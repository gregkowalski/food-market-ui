import React from 'react'
import './Order.css'
import { Button, Image, Icon, Message, Dropdown, Checkbox } from 'semantic-ui-react'
import { Accordion, Header, Divider, Form, Segment, Input } from 'semantic-ui-react'
import { Radio } from 'semantic-ui-react'
import FoodItems from './data/FoodItems'
import Users from './data/Users'
import AWS from 'aws-sdk'
// import Autocomplete from 'react-google-autocomplete';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment'
import { parse as parsePhone, asYouType as asYouTypePhone } from 'libphonenumber-js'
import OrderHeader from './components/OrderHeader'
import FoodLightbox from './components/FoodLightbox'
import Checkout from './Stripe/Checkout'
import { FeatureToggles } from './FeatureToggles'
import ApiClient from './Api/ApiClient'
import CognitoUtil from './Cognito/CognitoUtil'
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';
import { Constants } from './Constants'

export default class Order extends React.Component {

    state = {
        quantity: 1,
        showPricingDetails: false,
        serviceFeeRate: Constants.ServiceFeeRate,
        acceptedTerms: false,
        hasBlurred: {},
        hasErrors: {},
        value: 'pick-up'
    };

    componentWillMount() {
        if (FeatureToggles.CognitoLogin) {
            CognitoUtil.setLastPathname(location.pathname);
            CognitoUtil.redirectToLoginIfNoSession();
        }

        let foodItem = this.getFoodItem();
        document.title = foodItem.header;
    }

    handleChange = (e, { value }) => this.setState({ value })

    getFoodItemId() {
        return parseInt(this.props.match.params.id, 10);
    }

    getFoodItem() {
        let foodItemId = this.getFoodItemId();
        return FoodItems.find(x => x.id === foodItemId);
    }

    getTotal(unitPrice) {
        let total = (this.state.quantity * unitPrice * (1 + this.state.serviceFeeRate));
        return total.toFixed(2);
    }

    getBaseTotal(unitPrice) {
        let baseTotal = this.state.quantity * unitPrice;
        return baseTotal.toFixed(2);
    }

    getServiceFee(unitPrice) {
        let fee = this.state.quantity * unitPrice * this.state.serviceFeeRate;
        return fee.toFixed(2);
    }

    handleAddressChange(place) {
        const value = place.formatted_address;
        this.setState({ address: value }, () => this.validateField('address', value))
    };

    handleQuantityChange(min, max, newValue) {
        if (newValue.length === 0) {
            this.setState({ quantity: newValue }, () => this.validateField('quantity', newValue));
            return;
        }
        let newQuantity = parseInt(newValue, 10);
        if (!newQuantity || isNaN(newQuantity) || newQuantity < min || newQuantity > max)
            return;

        this.setState({ quantity: newQuantity }, () => this.validateField('quantity', newQuantity));
    };

    handleClickQuantityChange(min, max, delta) {
        var quantity = this.state.quantity;
        if (quantity.length === 0) {
            quantity = 0;
        }
        let change = (delta > 0) ? 1 : -1;
        let newQuantity = quantity + change;
        if (newQuantity < min || newQuantity > max)
            return;

        let newState = { quantity: newQuantity };
        this.setState(newState, () => this.validateField('quantity', newQuantity));
    }

    handlePricingDetailsClick = (e, titleProps) => {
        const showPricingDetails = !this.state.showPricingDetails;
        this.setState({ showPricingDetails: showPricingDetails });
    };

    handleDateChange(date) {
        const value = date.toDate()
        this.setState({ date: value }, () => this.validateField('date', value));
    };

    handleTimeChange = (event, data) => {
        const value = this.times.find(time => time.value === data.value).text
        this.setState({ time: value }, () => this.validateField('time', value));
    };

    handlePhoneNumberChange = (e) => {
        const name = e.target.name;
        let value = this.getAsYouTypePhone(e.target.value);
        e.target.value = value;

        let newHasBlurred = Object.assign({}, this.state.hasBlurred);
        newHasBlurred[name] = true;
        let newState = {
            [name]: value,
            hasBlurred: newHasBlurred
        };

        console.log(name + ': ' + value);
        this.setState(newState, () => this.validateField(name, value));
    }

    getAsYouTypePhone(value) {
        if (!value.startsWith('+1')) {
            if (value.startsWith('1')) {
                value = '+' + value;
            }
            else {
                value = '+1' + value;
            }
        }
        value = new asYouTypePhone('US').input(value);
        return value;
    }

    handleContactInfoChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        let newHasBlurred = Object.assign({}, this.state.hasBlurred);
        newHasBlurred[name] = true;
        let newState = {
            [name]: value,
            hasBlurred: newHasBlurred
        };

        console.log(name + ': ' + value);
        this.setState(newState, () => this.validateField(name, value));
    }

    handleContactInfoBlur = (e) => {
        const name = e.target.name;
        console.log('Blur: ' + name);

        let hasBlurred = Object.assign({}, this.state.hasBlurred);
        hasBlurred[name] = true;
        this.setState({ hasBlurred: hasBlurred }, () => { this.validateField(name) });
    }

    validateField(fieldName, fieldValue) {
        if (!fieldValue) {
            fieldValue = this.state[fieldName];
        }

        let hasBlurred = this.state.hasBlurred;
        let state = this.state;

        let hasErrors = {};

        switch (fieldName) {
            case 'quantity':
                let food = this.getFoodItem();
                hasErrors.quantity = false;
                if (!state.quantity || state.quantity < 1 || state.quantity > food.availability) {
                    hasErrors.quantity = true;
                }
                break;

            case 'firstName':
                hasErrors.firstName = false;
                if (hasBlurred.firstName && !state.firstName) {
                    hasErrors.firstName = true;
                }
                break;

            case 'lastName':
                hasErrors.lastName = false;
                if (hasBlurred.lastName && !state.lastName) {
                    hasErrors.lastName = true;
                }
                break;

            case 'phone':
                hasErrors.phone = false;
                if (hasBlurred.phone && !this.validatePhoneNumber(state.phone)) {
                    hasErrors.phone = true;
                }
                break;

            case 'email':
                hasErrors.email = false;
                if (hasBlurred.email && !this.validateEmail(state.email)) {
                    hasErrors.email = true;
                }
                break;

            case 'address':
                hasErrors.address = false;
                if (hasBlurred.address && !state.address) {
                    hasErrors.address = true;
                }
                break;

            case 'date':
                hasErrors.date = false;
                if (hasBlurred.date && !state.date) {
                    hasErrors.date = true;
                }
                break;

            case 'time':
                hasErrors.time = false;
                if (hasBlurred.time && !state.time) {
                    hasErrors.time = true;
                }
                break;

            default:
                break;
        }

        hasErrors = Object.assign(this.state.hasErrors, hasErrors);
        this.setState({ hasErrors });
    }

    validateForm() {
        let state = this.state;
        let hasErrors = {};

        let food = this.getFoodItem();
        hasErrors.quantity = false;
        if (!state.quantity || state.quantity < 1 || state.quantity > food.availability) {
            hasErrors.quantity = true;
        }

        // hasErrors.firstName = false;
        // if (!state.firstName) {
        //     hasErrors.firstName = true;
        // }

        // hasErrors.lastName = false;
        // if (!state.lastName) {
        //     hasErrors.lastName = true;
        // }

        hasErrors.phone = false;
        if (!this.validatePhoneNumber(state.phone)) {
            hasErrors.phone = true;
        }

        hasErrors.email = false;
        if (!this.validateEmail(state.email)) {
            hasErrors.email = true;
        }

        // hasErrors.address = false;
        // if (!state.address) {
        //     hasErrors.address = true;
        // }

        hasErrors.date = false;
        if (!state.date) {
            hasErrors.date = true;
        }

        hasErrors.time = false;
        if (!state.time) {
            hasErrors.time = true;
        }

        hasErrors = Object.assign(this.state.hasErrors, hasErrors);
        this.setState({ hasErrors });
        return this.isValid(hasErrors);
    }

    validateEmail(email) {
        if (!email) {
            return false;
        }
        var pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(email);
    }

    validatePhoneNumber(phone) {
        if (!phone) {
            return false;
        }
        const result = parsePhone(phone);
        console.log('parsePhone: ' + JSON.stringify(result));
        return result.phone ? true : false;
    }

    isValid(hasErrors) {
        for (let v in hasErrors) {
            if (hasErrors[v] === true) {
                return false;
            }
        }
        return true;
    }

    dateCutoff = moment().add(36, 'hours');

    isDayOutsideRange = (day) => {

        const year1 = day.year();
        const month1 = day.month();
        const day1 = day.date();

        const year2 = this.dateCutoff.year();
        const month2 = this.dateCutoff.month();
        const day2 = this.dateCutoff.date();

        //console.log(`dateCutoff=${year2}-${month2}-${day2}, day=${year1}-${month1}-${day1}`);

        if (year1 !== year2)
            return year1 < year2;

        if (month1 !== month2)
            return month1 < month2;

        return day1 < day2;
    }

    sendEmails() {
        const aws_secret_access_key = '3Tb2qswQeoB31bMjlbM0OS1FEX0uEgzCF66LEbfK'
        const aws_access_key_id = 'AKIAI3G26HX46HETLCJQ'

        let creds = new AWS.Credentials(aws_access_key_id, aws_secret_access_key);
        AWS.config.update({
            region: 'us-west-2',
            credentials: creds
        });

        // var payload = {
        //     foodId: food.id,
        //     foodName: food.header,
        //     totalPrice: this.getTotal(food.price),
        //     quantity: this.state.quantity,
        //     date: this.state.date,
        //     time: this.state.time,
        //     apt: this.state.apt,
        //     address: this.state.address,
        //     firstName: this.state.firstName,
        //     lastName: this.state.lastName,
        //     phone: this.state.phone,
        //     email: this.state.email
        // };

        let food = this.getFoodItem();
        let address = (this.state.apt ? 'Apt ' + this.state.apt + ', ' : '') + this.state.address;
        let orderText = 'The following order was submitted at ' + new Date() + '\r\n' +
            'Item Id: ' + food.id + '\r\n' +
            'Name: ' + food.header + '\r\n' +
            'Quantity: ' + this.state.quantity + '\r\n' +
            'Total Price: $' + this.getTotal(food.price) + ' CAD\r\n' +
            'Date: ' + this.state.date + '\r\n' +
            'Time: ' + this.state.time + '\r\n\r\n' +

            'Contact Information\r\n' +
            'First Name: ' + this.state.firstName + '\r\n' +
            'Last Name: ' + this.state.lastName + '\r\n' +
            'Phone: ' + this.state.phone + '\r\n' +
            'Email: ' + this.state.email + '\r\n' +
            'Address: ' + address + '\r\n\r\n' +

            'Now go fill this order!'



        // Create the promise and SES service object
        let subject = 'New Order: ' + food.header;

        let systemEmail = this.createEmail('gregkowalski@hotmail.com', subject, orderText);
        let systemSendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(systemEmail).promise();

        let userEmail = this.createEmail(this.state.email, subject, orderText);
        var userSendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(userEmail).promise();

        return { systemSendPromise, userSendPromise };
    }

    createEmail(toAddress, subject, body) {
        // Create sendEmail params 
        var params = {
            Destination: { /* required */
                // CcAddresses: [
                //   'EMAIL_ADDRESS',
                //   /* more items */
                // ],
                ToAddresses: [
                    toAddress,
                    /* more items */
                ]
            },
            Message: { /* required */
                Body: { /* required */
                    // Html: {
                    //     Charset: "UTF-8",
                    //     Data: "<h3>this is formatted crap, <strong>bro</strong></h3>"
                    // },
                    Text: {
                        Charset: "UTF-8",
                        Data: body
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject
                }
            },
            Source: '"Food Market" <foodmarket@cosmo-test.com>'
            //   ReplyToAddresses: [
            //       'EMAIL_ADDRESS',
            //     /* more items */
            //   ],
        };
        return params;
    }

    times = [
        { key: 0, text: 'Breakfast (7 AM - 11 AM)', value: 0 },
        { key: 1, text: 'Lunch (11 AM - 3 PM)', value: 1 },
        { key: 2, text: 'Dinner (3 PM - 7 PM)', value: 2 },
    ];

    render() {
        let foodItemId = this.getFoodItemId();
        let food = FoodItems.find(x => x.id === foodItemId);
        let user = Users.find(x => x.id === food.userId);

        const { showPricingDetails } = this.state;

        let deliveryElement;
        if (food.delivery) {
            deliveryElement =
                <strong> Delivery</strong>
        }

        let pickupElement;
        if (food.pickup) {
            pickupElement =
                <strong>Pick-up</strong>
        }

        return (
            <div>
                <OrderHeader fixed />
                <div>
                    <FoodLightbox foodItemId={food.id} />

                    <div className='order-body'>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2em', fontWeight: 'bold', lineHeight: '1.1' }}>{food.header}</div>
                            <div style={{ fontSize: '1.2em', marginTop: '0.5em' }}>
                                by {user.name}
                                <Image avatar src={user.image} style={{ marginLeft: '10px' }} />
                            </div>
                        </div>


                        <Divider />

                        <Header>Quantity ({food.availability} available)</Header>
                        <Form.Group inline>
                            <Form.Field>
                                <Button className='order-quantity-button' icon='minus' size='large' onClick={() => this.handleClickQuantityChange(1, food.availability, -1)} />
                                <Input type='number'
                                    onChange={(e, { value }) => this.handleQuantityChange(1, food.availability, value)}
                                    value={this.state.quantity} min={1} max={food.availability}
                                    style={{ fontSize: '1.1em', width: '3.5em', marginLeft: '0.3em', marginRight: '0.5em' }} />
                                <Button className='order-quantity-button' icon='plus' size='large' onClick={() => this.handleClickQuantityChange(1, food.availability, 1)} />
                            </Form.Field>
                        </Form.Group>
                        <div style={{ marginTop: '0.5em' }}>{this.state.quantity} x ${food.price} (per unit) = ${this.getBaseTotal(food.price)} (base price)</div>
                        <Message error hidden={!this.state.hasErrors.quantity} header='Invalid Quantity' content='Please select at least 1 unit per order.' icon='exclamation circle' />

                        <Divider />

                        <Form noValidate autoComplete='off'>

                            <Header>My Information</Header>

                            <Form.Group widths='4'>
                                <Form.Field>
                                    <Segment compact>
                                        <span style={{ marginRight: '11px' }}>
                                            {pickupElement}
                                        </span>
                                        <Radio toggle
                                            label=''
                                            name='radioGroup'
                                            value='pick-up'
                                            checked={this.state.value === 'pick-up'}
                                            onChange={this.handleChange}
                                        />
                                    </Segment>
                                </Form.Field>
                                <Form.Field>
                                    <Segment compact>
                                        <Radio toggle
                                            label='Disabled'
                                            name='radioGroup'
                                            value='delivery'
                                            checked={this.state.value === 'delivery'}
                                            onChange={this.handleChange}
                                            disabled
                                        />
                                        <span style={{ marginLeft: '4px' }}> {deliveryElement}
                                        </span>
                                    </Segment>
                                </Form.Field>
                            </Form.Group>

                            {/* <Form.Group widths='equal'>
                                <Form.Field required error={this.state.hasErrors.firstName}>
                                    <label>First name</label>
                                    <Input name='firstName' placeholder='First name' onChange={this.handleContactInfoChange} onBlur={this.handleContactInfoBlur} />
                                    <Message error visible={this.state.hasErrors.firstName} header='Invalid first name' content='Please enter your first name' icon='exclamation circle' />
                                </Form.Field>
                                <Form.Field required error={this.state.hasErrors.lastName}>
                                    <label>Last name</label>
                                    <Input name='lastName' placeholder='Last name' onChange={this.handleContactInfoChange} onBlur={this.handleContactInfoBlur} />
                                    <Message error visible={this.state.hasErrors.lastName} header='Invalid last name' content='Please enter your last name' icon='exclamation circle' />
                                </Form.Field>
                            </Form.Group> */}
                            <Form.Group widths='equal'>
                                <Form.Field required error={this.state.hasErrors.phone}>
                                    <label>Phone</label>
                                    <Input required name='phone' type='tel' placeholder='Phone' onChange={this.handlePhoneNumberChange} onBlur={this.handleContactInfoBlur} />
                                    <Message error visible={this.state.hasErrors.phone} header='Invalid phone number' content='Please enter your phone number' icon='exclamation circle' />
                                </Form.Field>

                                <Form.Field required error={this.state.hasErrors.email}>
                                    <label>Email</label>
                                    <Input required name='email' type='email' placeholder='Email' onChange={this.handleContactInfoChange} onBlur={this.handleContactInfoBlur} />
                                    <Message error visible={this.state.hasErrors.email} header='Invalid email' content='Please enter your email address' icon='exclamation circle' />
                                </Form.Field>
                            </Form.Group>
                            {/* <Form.Group widths='equal'>
                                <Form.Field required error={this.state.hasErrors.address}>
                                    <label>Street Address</label>
                                    <Autocomplete className="order-address"
                                        name='address'
                                        onPlaceSelected={(place) => this.handleAddressChange(place)}
                                        onChange={this.handleContactInfoChange}
                                        onBlur={this.handleContactInfoBlur}
                                        types={['address']}
                                        placeholder='Address'
                                        componentRestrictions={{ country: 'ca' }} />
                                    <Message error visible={this.state.hasErrors.address} header='Invalid address' content='Please enter your address' icon='exclamation circle' />
                                </Form.Field>
                                <Form.Input name='apt' label='Apartment' placeholder='Apartment' onChange={this.handleContactInfoChange} onBlur={this.handleContactInfoBlur} />
                            </Form.Group> */}

                            <Form.Group widths='equal'>

                                <Form.Field required error={this.state.hasErrors.date}>
                                    <label>Date</label>
                                    <SingleDatePicker
                                        date={this.state.day} // momentPropTypes.momentObj or null
                                        isOutsideRange={this.isDayOutsideRange}
                                        onDateChange={day => {
                                            this.setState({ day });
                                            this.handleDateChange(day);
                                        }} // PropTypes.func.isRequired
                                        focused={this.state.focused} // PropTypes.bool
                                        onFocusChange={({ focused }) => {
                                            this.setState({ focused });
                                            if (!focused) {
                                                this.handleContactInfoBlur({ target: { name: 'date' } });
                                            }
                                        }} // PropTypes.func.isRequired
                                        numberOfMonths={1}
                                        placeholder="Date"
                                        displayFormat={() =>
                                            //moment.localeData().longDateFormat('LL')
                                            'MMMM DD, YYYY'
                                        }
                                    />
                                    <Message error visible={this.state.hasErrors.date} header='Invalid date' content='Please select a date' icon='exclamation circle' />
                                </Form.Field>
                                <Form.Field required error={this.state.hasErrors.time}>
                                    <label>Time</label>
                                    <Dropdown
                                        placeholder='Time'
                                        selection
                                        options={this.times}
                                        onChange={this.handleTimeChange}
                                        onBlur={() => this.handleContactInfoBlur({ target: { name: 'time' } })} />
                                    <Message error visible={this.state.hasErrors.time} header='Invalid time' content='Please select a time' icon='exclamation circle' />
                                </Form.Field>
                            </Form.Group>

                            <Divider />

                            <Header>My Order Summary</Header>

                            <Segment style={{ maxWidth: '400px', minWidth: '250px' }}>
                                {this.state.quantity} {food.header}
                                <Form.Field>
                                    <div style={{ marginTop: '3px' }}> Order type: <strong>{this.state.value}</strong> </div>
                                </Form.Field>
                                <Divider />
                                <div style={{ marginTop: '3px' }}> <strong>Total (CAD): ${this.getTotal(food.price)}</strong></div>
                            </Segment>

                            <Accordion>
                                <Accordion.Title active={showPricingDetails} onClick={this.handlePricingDetailsClick}>
                                    <Icon name='dropdown' />
                                    See pricing details
                            </Accordion.Title>
                                <Accordion.Content active={showPricingDetails}>
                                    <Segment style={{ maxWidth: '400px', minWidth: '250px' }}>
                                        <Header as='h5'>Payment Breakdown</Header>
                                        <div className='order-summary-row'>
                                            <div className='align-left'>
                                                {this.state.quantity} x ${food.price} {food.header}
                                            </div>
                                            <div className='align-right'>
                                                ${this.getBaseTotal(food.price)}
                                            </div>
                                        </div>
                                        <div className='order-summary-row'>
                                            <div className='align-left'>
                                                Service fee
                                            </div>
                                            <div className='align-right'>
                                                ${this.getServiceFee(food.price)}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.8em', marginLeft: '10px', color: 'gray', maxWidth: '250px' }}>
                                            this helps run our platform and keep the lights on
                                        </div>

                                        <Divider />

                                        <div className='order-summary-row'>
                                            <div className='align-left'>
                                                <strong>Total</strong>
                                            </div>
                                            <div className='align-right'>
                                                <strong> ${this.getTotal(food.price)}</strong>
                                            </div>
                                        </div>
                                    </Segment>
                                </Accordion.Content>
                            </Accordion>

                            <Divider />

                            {FeatureToggles.StripePayment &&
                                <Checkout onRef={ref => (this.checkout = ref)} />
                            }

                            <Checkbox label="I agree to this site's user and customer refund policy. I am over the age of 18. I also agree to pay the total amount shown, which includes service fees."
                                onChange={() => this.setState({ acceptedTerms: !this.state.acceptedTerms })} />

                            <div style={{ marginTop: '20px' }}>
                                <Button
                                    className='order-confirm-button'
                                    fluid
                                    loading={this.state.orderProcessing}
                                    disabled={!this.state.acceptedTerms}
                                    onClick={() => this.handleOrderButtonClick()}>
                                    Confirm my order for ${this.getTotal(food.price)}
                                </Button>
                            </div>

                        </Form >
                    </div>
                </div>
            </div>
        )
    }

    handleOrderButtonClick() {
        if (FeatureToggles.StripePayment) {
            this.submitOrderNew();
        }
        else {
            this.submitOrderOld();
        }
    }

    submitOrderOld() {
        if (!this.validateForm())
            return null;

        let { systemSendPromise, userSendPromise } = this.sendEmails();
        systemSendPromise.then(result1 => {
            console.log(`system email sent: ${result1.MessageId}`);

            userSendPromise.then(result2 => {
                console.log(`user email sent: ${result2.MessageId}`);
                this.props.history.push('orderSuccess?sentCount=2');
            })
                .catch(err2 => {
                    console.error(err2, err2.stack);
                    this.props.history.push('orderSuccess?sentCount=1');
                })
        }).catch(err1 => {
            console.error(err1, err1.stack);
            this.props.history.push('orderError');
        });
    }

    submitOrderNew() {
        if (this.state.orderProcessing) {
            console.log('Order is already processing...')
            return;
        }

        const auth = new CognitoAuth(CognitoUtil.getCognitoAuthData());
        const session = auth.getCachedSession();
        if (!session || !session.isValid()) {
            console.error('Cannot submit order without a logged-in user.  Please log in and try again.');
            return;
        }

        if (!this.validateForm()) {
            console.log('Order form validation failed.  Please correct your information and try again.');
            return;
        }

        console.log('Order processing');
        this.setState({ orderProcessing: true });

        const food = this.getFoodItem();
        const order = {
            foodItemId: food.id,
            quantity: this.state.quantity,
            date: this.state.date,
            time: this.state.time,
            apt: this.state.apt,
            address: this.state.address,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phone: this.state.phone,
            email: this.state.email
        };

        this.checkout.props.stripe.createToken()
            .then(payload => {
                if (payload.error) {
                    console.error(payload.error.message);
                    throw new Error(payload.error.message);
                }
                else {
                    let apiClient = new ApiClient();
                    return apiClient.submitFoodOrder(session.getIdToken().getJwtToken(), payload.token, order);
                }
            })
            .then(response => {
                console.log('Order finished');
                console.log(response);
                this.setState({ orderProcessing: false });
                this.props.history.push('orderSuccess?sentCount=2');
            })
            .catch(err => {
                console.log('Order finished');
                console.error(err);
                this.setState({ orderProcessing: false });
                this.props.history.push('orderError');
            });
    }
}