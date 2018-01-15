import React from 'react'
import './Order.css'
import { Button, Image, Icon, Message, Dropdown, Checkbox, Rating, Popup } from 'semantic-ui-react'
import { Accordion, Header, Divider, Form, Segment, Input, Step, Grid } from 'semantic-ui-react'
import FoodItems from './data/FoodItems'
import AWS from 'aws-sdk'
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment'
import { parse as parsePhone, asYouType as asYouTypePhone } from 'libphonenumber-js'
import OrderHeader from './components/OrderHeader'
import Checkout from './Stripe/Checkout'
import ApiClient from './Api/ApiClient'
import CognitoUtil from './Cognito/CognitoUtil'
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth'
import { Constants } from './Constants'
import { FeatureToggles } from './FeatureToggles'
import PriceCalc from './PriceCalc'


const Steps = {
    pickup: 0,
    billing: 1,
    confirm: 2
}

export default class Order extends React.Component {

    state = {
        quantity: 1,
        showPricingDetails: false,
        acceptedTerms: false,
        hasBlurred: {},
        hasErrors: {},
        value: 'pick-up',
        currentStep: Steps.pickup
    };

    cook;
    food;

    componentWillMount() {
        CognitoUtil.setLastPathname(location.pathname);
        CognitoUtil.redirectToLoginIfNoSession();

        this.food = this.getFoodItem();
        document.title = this.food.header;

        let apiClient = new ApiClient();
        apiClient.getUserByJsUserId(this.food.userId)
            .then(response => {
                this.cook = response.data;
                this.forceUpdate();
            })
            .catch(err => {
                console.error(err);
            });
    }

    handleChange = (e, { value }) => this.setState({ value })

    getFoodItemId() {
        return parseInt(this.props.match.params.id, 10);
    }

    getFoodItem() {
        let foodItemId = this.getFoodItemId();
        return FoodItems.find(x => x.id === foodItemId);
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
                hasErrors.quantity = false;
                if (!state.quantity || state.quantity < 1 || state.quantity > Constants.MaxFoodQuantity) {
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

        hasErrors.quantity = false;
        if (!state.quantity || state.quantity < 1 || state.quantity > Constants.MaxFoodQuantity) {
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

        let food = this.food;
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

        let subject = 'New Order: ' + food.header;

        let systemEmail = this.createEmail('gregkowalski@hotmail.com', subject, orderText);
        let systemSendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(systemEmail).promise();

        let userEmail = this.createEmail(this.state.email, subject, orderText);
        var userSendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(userEmail).promise();

        return { systemSendPromise, userSendPromise };
    }

    createEmail(toAddress, subject, body) {
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
        let food = this.food;
        const { showPricingDetails } = this.state;

        // let deliveryElement;
        // if (food.delivery) {
        //     deliveryElement = ''
        //     // <strong> Delivery</strong>
        // }

        // let pickupElement;
        // if (food.pickup) {
        //     pickupElement =
        //         <strong>Pick-up</strong>
        // }

        let currentStepComponent;
        if (this.state.currentStep === Steps.pickup) {
            currentStepComponent =
                <div className='order-detail-summary-container'>
                    <div className='order-detail-summary-left'>
                        <Segment>
                            <Header className='order-detail-summary-left-header'>Order Details</Header>
                            <Divider />
                            <div className='order-card-header'>
                                <Image floated='right' style={{ marginTop: '5px 0px 0px 15px' }} src={food.image} height='auto' width='26%' />
                                <div className='order-card-header-overflow'>{food.header} </div>
                                <div style={{ display: 'flex', width: '200px' }}>
                                    <Rating disabled={true} maxRating={5} rating={food.rating} size='mini'
                                        style={{ marginTop: '4px' }} />
                                    <div style={{ marginTop: '0px', fontSize: 'small', color: '#494949' }}>{food.ratingCount}</div>
                                </div>
                                <div style={{ clear: 'both' }}></div>
                            </div>
                            <Divider />
                            <Form.Group inline style={{ padding: '0px 10px 10px 10px' }}>
                                <Form.Field>
                                    <div style={{ textAlign: 'left', marginBottom: '8px', fontFamily: 'Athiti', fontSize: '1.05em' }}>
                                        Quantity ({food.unit} per order)</div>
                                    <div>
                                        <Button className='order-quantity-button' icon='minus' size='large' onClick={() => this.handleClickQuantityChange(1, Constants.MaxFoodQuantity, -1)} />
                                        <Input
                                            type='number'
                                            onChange={(e, { value }) => this.handleQuantityChange(1, Constants.MaxFoodQuantity, value)}
                                            onBlur={(e) => this.handleQuantityInputBlur(e)}
                                            value={this.state.quantity} min={1} max={99}
                                            style={{ fontSize: '1.1em', width: '3.5em', marginLeft: '0.3em', marginRight: '0.5em' }} />
                                        <Button className='order-quantity-button' icon='plus' size='large' onClick={() => this.handleClickQuantityChange(1, Constants.MaxFoodQuantity, 1)} />
                                    </div>
                                </Form.Field>
                            </Form.Group>
                            <div style={{ padding: '0px 10px 10px 10px' }}>
                                <div className='detail-card-summary-row' style={{ marginTop: '12px' }} >
                                    <div className='order-summary-align-left'>
                                        ${PriceCalc.getBaseTotal(food.price, this.state.quantity)} x {this.state.quantity} order size
                                        </div>
                                    <div className='order-summary-align-right'>
                                        ${PriceCalc.getBaseTotal(food.price, this.state.quantity)}
                                    </div>
                                </div>
                                <Divider />
                                <div className='detail-card-summary-row'>
                                    <div className='order-summary-align-left'>
                                        Service fee <Popup
                                            trigger={<Icon size='small' name='question circle outline' />}
                                            content='This helps run our platform and keep the lights on.'
                                            on={['click']}
                                            hideOnScroll />
                                    </div>
                                    <Divider />
                                    <div className='order-summary-align-right'>
                                        ${PriceCalc.getServiceFee(food.price, this.state.quantity)}
                                    </div>
                                </div>
                                <Divider />
                                <div className='detail-card-summary-row-total'>
                                    <div className='order-summary-align-left'>
                                        <strong>Total </strong>
                                    </div>
                                    <div className='order-summary-align-right'>
                                        <span style={{ fontWeight: '500' }}> ${PriceCalc.getTotal(food.price, this.state.quantity)}</span>
                                    </div>
                                </div>
                            </div>
                        </Segment>
                    </div>
                    <div className='order-detail-summary-right'>
                        <Segment padded>
                            <Header className='order-detail-summary-left-header'>Date &amp; Time</Header>
                            <Divider />
                            <Grid stackable columns='equal'>
                                <Grid.Row>
                                    <Grid.Column>
                                        <div>Date</div>
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
                                        <Message
                                            hidden={!this.state.hasErrors.phone}
                                            visible={this.state.hasErrors.date} header='Invalid date' content='Please select a date' icon='exclamation circle' />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <div>Time</div>
                                        <Dropdown
                                            placeholder='Time'
                                            selection
                                            options={this.times}
                                            onChange={this.handleTimeChange}
                                            onBlur={() => this.handleContactInfoBlur({ target: { name: 'time' } })} />
                                        <Message
                                            hidden={this.state.hasErrors.time}
                                            error visible={this.state.hasErrors.time} header='Invalid time' content='Please select a time' icon='exclamation circle' />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                        <Segment padded>
                            <Header className='order-detail-summary-left-header'>Contact Information</Header>
                            <Divider />
                            <Grid stackable columns='equal'>
                                <Grid.Row>
                                    <Grid.Column>
                                        <div>First name</div>
                                        <Input name='firstName' placeholder='First name' onChange={this.handleContactInfoChange} onBlur={this.handleContactInfoBlur} />
                                        <Message error={this.state.hasErrors.firstName}
                                            hidden={!this.state.hasErrors.firstName}
                                            visible={this.state.hasErrors.firstName} header='Invalid first name' content='Please enter your first name' icon='exclamation circle' />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <div>Last name</div>
                                        <Input name='lastName' placeholder='Last name' onChange={this.handleContactInfoChange} onBlur={this.handleContactInfoBlur} />
                                        <Message error={this.state.hasErrors.lastName}
                                            hidden={!this.state.hasErrors.lastName}
                                            visible={this.state.hasErrors.lastName} header='Invalid last name' content='Please enter your last name' icon='exclamation circle' />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>

                            <Grid stackable columns='equal'>
                                <Grid.Row>
                                    <Grid.Column>
                                        <div>Phone</div>
                                        <Input name='phone' type='tel' placeholder='Phone' onChange={this.handlePhoneNumberChange} onBlur={this.handleContactInfoBlur} />
                                        <Message error={this.state.hasErrors.phone}
                                            hidden={!this.state.hasErrors.phone}
                                            visible={this.state.hasErrors.phone} header='Invalid phone number' content='Please enter your phone number' icon='exclamation circle' />
                                    </Grid.Column>
                                    <Grid.Column>
                                        {/* placeholder column to keep a single column aligned */}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                        <div>
                            {/* <Header style={{ float: 'left' }} className='order-detail-summary-next-button-header'>Continue</Header> */}
                            <Button className='order-confirm-continue-button' floated='right' size='huge' icon onClick={() => {
                                if (this.state.currentStep < Steps.confirm + 1) {
                                    this.setState({ currentStep: this.state.currentStep + 1 });
                                }
                            }}>
                                Continue</Button>
                        </div>
                        {/* </Segment> */}

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
                                </Form.Group>
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
                                </Form.Group> */}
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

                        {/* <Form.Group widths='equal'>
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
                            </Segment> */}

                    </div>

                    {/* </Form> */}
                </div>;
        }
        else if (this.state.currentStep === Steps.billing) {
            currentStepComponent =
                <div>This is how we do billing
                  {FeatureToggles.StripePayment &&
                        <Checkout onRef={ref => (this.checkout = ref)} />
                    }
                </div>;
        }
        else if (this.state.currentStep === Steps.confirm) {
            currentStepComponent =
                <div>This is how we do confirm
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
                                        ${PriceCalc.getBaseTotal(food.price, this.state.quantity)}
                                    </div>
                                </div>
                                <div className='order-summary-row'>
                                    <div className='align-left'>
                                        Service fee
                                            </div>
                                    <div className='align-right'>
                                        ${PriceCalc.getServiceFee(food.price, this.state.quantity)}
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
                                        <strong> ${PriceCalc.getTotal(food.price, this.state.quantity)}</strong>
                                    </div>
                                </div>
                            </Segment>
                        </Accordion.Content>
                    </Accordion>

                    <Divider />

                    <Checkbox label="I agree to this site's user and customer refund policy and that I am over the age of 18. I also agree to pay the total amount shown, which includes service fees."
                        onChange={() => this.setState({ acceptedTerms: !this.state.acceptedTerms })} />

                    <div style={{ marginTop: '20px' }}>
                        <Button
                            className='order-confirm-button'
                            fluid
                            loading={this.state.orderProcessing}
                            disabled={!this.state.acceptedTerms}
                            onClick={() => this.handleOrderButtonClick()}>
                            Confirm my order for ${PriceCalc.getTotal(food.price, this.state.quantity)}
                        </Button>
                    </div>
                </div>;
        }
        else {
            currentStepComponent =
                <div>
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
                                        ${PriceCalc.getBaseTotal(food.price, this.state.quantity)}
                                    </div>
                                </div>
                                <div className='order-summary-row'>
                                    <div className='align-left'>
                                        Service fee
                                            </div>
                                    <div className='align-right'>
                                        ${PriceCalc.getServiceFee(food.price, this.state.quantity)}
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
                                        <strong> ${PriceCalc.getTotal(food.price, this.state.quantity)}</strong>
                                    </div>
                                </div>
                            </Segment>
                        </Accordion.Content>
                    </Accordion>
                </div>;
        }

        return (
            <div>
                <OrderHeader fixed />
                <div className='order-body'>
                    <div className='order-navigation-header'>
                        <div><Button className='order-button' size='huge' icon onClick={() => {
                            if (this.state.currentStep > Steps.pickup) {
                                this.setState({ currentStep: this.state.currentStep - 1 });
                            }
                        }}>
                            <Icon name='left arrow' />
                        </Button>
                        </div>
                        <div className='order-navigation-middle-content'>{Constants.AppName}</div>
                        <div><Button className='order-button' size='huge' icon onClick={() => {
                            if (this.state.currentStep < Steps.confirm + 1) {
                                this.setState({ currentStep: this.state.currentStep + 1 });
                            }
                        }}>
                            <Icon name='right arrow' />
                        </Button>
                        </div>
                        {/* <div style={{ clear: 'both' }} /> */}
                    </div>
                    <div className='order-step-header'>
                        <Step.Group unstackable widths={3}>
                            <Step active={this.state.currentStep === Steps.pickup}
                                completed={this.state.currentStep > Steps.pickup}
                                disabled={this.state.currentStep < Steps.pickup}
                                className='order-step-boxes'>
                                {/* <Icon name='shopping basket' /> */}
                                <Step.Content>
                                    <Step.Title>Review</Step.Title>
                                </Step.Content>
                            </Step>
                            <Step active={this.state.currentStep === Steps.billing}
                                completed={this.state.currentStep > Steps.billing}
                                disabled={this.state.currentStep < Steps.billing}
                                className='order-step-boxes'>
                                {/* <Icon name='credit card' /> */}
                                <Step.Content>
                                    <Step.Title>Payment</Step.Title>
                                </Step.Content>
                            </Step>
                            <Step active={this.state.currentStep === Steps.confirm}
                                completed={this.state.currentStep > Steps.confirm}
                                disabled={this.state.currentStep < Steps.confirm}
                                className='order-step-boxes'>
                                {/* <Icon name='info' /> */}
                                <Step.Content>
                                    <Step.Title>Confirm</Step.Title>
                                </Step.Content>
                            </Step>
                        </Step.Group>
                    </div>
                    <div>
                        {currentStepComponent}
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

        const food = this.food;
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