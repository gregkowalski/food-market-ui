import React from 'react'
import { parse as parsePhone, asYouType as asYouTypePhone } from 'libphonenumber-js'
import { Button, Image, Icon, Message, Dropdown, Checkbox, Radio } from 'semantic-ui-react'
import { Accordion, Header, Divider, Form, Segment, Input, Step, Grid } from 'semantic-ui-react'
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './Order.css'
import OrderHeader from './components/OrderHeader'
import Checkout from './Stripe/Checkout'
import ApiClient from './Api/ApiClient'
import CognitoUtil from './Cognito/CognitoUtil'
import { Constants } from './Constants'
import PriceCalc from './PriceCalc'
import Util from './Util'

const Steps = {
    pickup: 0,
    billing: 1,
    confirm: 2
}

const ContactMethods = {
    email: 0,
    phone: 1
}

const OrderTimes = [
    { key: 0, text: 'Breakfast (7 AM - 11 AM)', value: 0 },
    { key: 1, text: 'Lunch (11 AM - 3 PM)', value: 1 },
    { key: 2, text: 'Dinner (3 PM - 7 PM)', value: 2 },
];

export default class Order extends React.Component {

    state = {
        quantity: 1,
        showServiceFee: false,
        showPricingDetails: false,
        acceptedTerms: false,
        hasBlurred: {},
        hasErrors: {},
        contactMethod: ContactMethods.email,
        currentStep: Steps.pickup,
        time: 0
    };

    cook;
    food;

    componentWillMount() {
        CognitoUtil.setLastPathname(window.location.pathname);
        CognitoUtil.redirectToLoginIfNoSession();

        ApiClient.getFood(this.props.match.params.id)
            .then(response => {                
                this.food = response.data;

                document.title = this.food.title;

                ApiClient.getUser(this.food.user_id)
                    .then(response => {
                        this.cook = response.data;
                        this.forceUpdate();
                    })
                    .catch(err => {
                        console.error(err);
                    });
            })
            .catch(err => {
                console.error(err);
            });
    }

    handleContactMethodChange = (e, { value }) => {
        this.setState({ contactMethod: value });
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

    handleServiceFeeClick = (e, titleProps) => {
        const showServiceFee = !this.state.showServiceFee;
        this.setState({ showServiceFee: showServiceFee });
    };

    handlePricingDetailsClick = (e, titleProps) => {
        const showPricingDetails = !this.state.showPricingDetails;
        this.setState({ showPricingDetails: showPricingDetails });
    };

    handleDateChange = (date) => {
        console.dir(date);
        this.setState({ date: date }, () => this.validateField('date', date.toDate()));
    };

    handleTimeChange = (event, data) => {
        this.setState({ time: data.value });
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

            case 'phone':
                hasErrors.phone = false;
                if (hasBlurred.phone && !this.validatePhoneNumber(state.phone)) {
                    hasErrors.phone = true;
                }
                break;

            case 'date':
                hasErrors.date = false;
                if (hasBlurred.date && !state.date) {
                    hasErrors.date = true;
                }
                break;

            default:
                break;
        }

        hasErrors = Object.assign(this.state.hasErrors, hasErrors);
        this.setState({ hasErrors });
    }

    handlePickupStepContinueClick = (e) => {
        if (!this.validatePickupStep()) {
            console.log('Pickup step validation failed.  Please enter the required information and try again.')
            return;
        }

        if (this.state.currentStep < Steps.confirm + 1) {
            this.setState({ currentStep: this.state.currentStep + 1 });
        }
    }

    validatePickupStep() {
        let state = this.state;
        let hasErrors = {};

        hasErrors.phone = false;
        if (this.state.contactMethod === ContactMethods.phone && !this.validatePhoneNumber(state.phone)) {
            hasErrors.phone = true;
        }

        hasErrors.date = false;
        if (!state.date) {
            hasErrors.date = true;
        }

        hasErrors = Object.assign(this.state.hasErrors, hasErrors);
        this.setState({ hasErrors });
        return this.isValid(hasErrors);
    }

    validatePaymentStep() {
        let state = this.state;
        let hasErrors = {};

        hasErrors.quantity = false;
        if (!state.quantity || state.quantity < 1 || state.quantity > Constants.MaxFoodQuantity) {
            hasErrors.quantity = true;
        }

        hasErrors = Object.assign(this.state.hasErrors, hasErrors);
        this.setState({ hasErrors });
        return this.isValid(hasErrors);
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

    render() {
        let food = this.food;
        if (!food) {
            return null;
        }
        const { showServiceFee, showPricingDetails } = this.state;

        let currentStepComponent;
        if (this.state.currentStep === Steps.pickup) {
            currentStepComponent =
                <div className='order-detail-summary-container'>
                    <div className='order-detail-summary-left'>
                        <Segment padded raised>
                            <Header className='order-detail-summary-left-header'>
                                <Icon name='shopping basket' /> My Order</Header>
                            <Divider />
                            <div className='order-card-header'>
                                <Image floated='right' style={{ marginTop: '5px 0px 0px 15px' }} src={food.imageUrls[0]} height='auto' width='26%' />
                                <div className='order-card-header-overflow'>{food.title} </div>
                            </div>
                            <Divider />
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
                                        <Accordion>
                                            <Accordion.Title active={showServiceFee} onClick={this.handleServiceFeeClick}>
                                            Service Fee
                                            <Icon className='order-service-fee-icon' size='small' name='question circle outline' />  
                                             </Accordion.Title>
                                            <Accordion.Content active={showServiceFee} className='order-service-fee-message'>
                                                This helps run our platform and keep the lights on.
                                            </Accordion.Content>
                                        </Accordion>
                                        {/* Service fee <Popup
                                            trigger={<Icon size='small' name='question circle outline' />}
                                            content='This helps run our platform and keep the lights on.'
                                            on={['click']}
                                            position='bottom center'
                                            hideOnScroll /> */}
                                    </div>
                                    <Divider />
                                    <div className='order-summary-align-service-fee'>
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
                            <Header className='order-detail-summary-left-header'>
                                <Icon name='calendar' />Date &amp; Time</Header>
                            <Divider />
                            <Grid className='order-segment-content' stackable columns='equal'>
                                <Grid.Row>
                                    <Grid.Column>
                                        <div>Date</div>
                                        <SingleDatePicker
                                            date={this.state.date} // momentPropTypes.momentObj or null
                                            isOutsideRange={Util.isDayOutsideRange}
                                            onDateChange={this.handleDateChange}
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
                                        <Message header='Invalid date' content='Please select a date' icon='exclamation circle'
                                            error={this.state.hasErrors.date}
                                            hidden={!this.state.hasErrors.date}
                                            visible={this.state.hasErrors.date} />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <div>Time</div>
                                        <Dropdown id='order-time-dropdown'
                                            selection
                                            placeholder='Time'
                                            options={OrderTimes}
                                            onChange={this.handleTimeChange}
                                            value={this.state.time} />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                        <Segment padded>
                            <Header className='order-detail-summary-left-header'>
                                <Icon name='phone' />Contact Info
                            </Header>
                            <Divider hidden />
                            <div className='order-segment-content-header'>
                                This will only be used for communication related to this order and will be kept private.
                            </div>
                            <Divider />
                            <Grid stackable columns='equal'>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Form className='order-segment-content'>
                                            <Form.Field>
                                                Preferred contact:
                                            </Form.Field>
                                            <Form.Field className='order-segment-contact-option'>
                                                <Radio
                                                    label='Email'
                                                    name='contactMethodRadioGroup'
                                                    value={ContactMethods.email}
                                                    checked={this.state.contactMethod === ContactMethods.email}
                                                    onChange={this.handleContactMethodChange}
                                                />
                                            </Form.Field>
                                            <Form.Field className='order-segment-contact-option'>
                                                <Radio
                                                    label='Phone (optional)'
                                                    name='contactMethodRadioGroup'
                                                    value={ContactMethods.phone}
                                                    checked={this.state.contactMethod === ContactMethods.phone}
                                                    onChange={this.handleContactMethodChange}
                                                />
                                            </Form.Field>
                                        </Form>
                                        <div className='order-contact-phone-input'>
                                            <Input name='phone' type='tel' placeholder='604 456 7890' value={this.state.phone}
                                                disabled={this.state.contactMethod !== ContactMethods.phone}
                                                onChange={this.handlePhoneNumberChange} onBlur={this.handleContactInfoBlur} />
                                            <Message header='Invalid phone number' content='Please enter your phone number' icon='exclamation circle'
                                                error={this.state.hasErrors.phone}
                                                hidden={this.state.contactMethod !== ContactMethods.phone || !this.state.hasErrors.phone}
                                                visible={this.state.contactMethod === ContactMethods.phone && this.state.hasErrors.phone} />
                                        </div>
                                    </Grid.Column>
                                    <Grid.Column>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                        <Segment padded='very'>
                            <Checkbox className='order-segment-user-agree-text'
                                label="I agree to this site's user and customer refund policy and that I am over the age of 18. I also agree to pay the total amount shown, which includes service fees."
                                onChange={() => this.setState({ acceptedTerms: !this.state.acceptedTerms })}
                                checked={this.state.acceptedTerms} />
                        </Segment>
                        <div>
                            <Button className='order-confirm-continue-button' floated='left' size='huge' icon
                                disabled={!this.state.acceptedTerms}
                                onClick={this.handlePickupStepContinueClick}>
                                <Icon name='lock' /> Continue
                            </Button>
                        </div>
                    </div>
                </div>
        }
        else if (this.state.currentStep === Steps.billing) {
            currentStepComponent =
                <div className='order-detail-summary-container'>
                    <div className='order-detail-summary-left-step-2'>
                        <Segment padded raised>
                            <Header className='order-detail-summary-left-header'>My Order</Header>
                            <Divider />
                            <div className='order-card-header'>
                                <Image floated='right' style={{ marginTop: '5px 0px 0px 15px' }} src={food.imageUrls[0]} height='auto' width='26%' />
                                <div className='order-card-header-overflow'>{food.title} </div>
                            </div>
                            <Divider />
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
                                    <Accordion>
                                            <Accordion.Title active={showServiceFee} onClick={this.handleServiceFeeClick}>
                                            Service Fee
                                            <Icon className='order-service-fee-icon' size='small' name='question circle outline' />  
                                             </Accordion.Title>
                                            <Accordion.Content active={showServiceFee} className='order-service-fee-message'>
                                                This helps run our platform and keep the lights on.
                                            </Accordion.Content>
                                        </Accordion>
                                    </div>
                                    <Divider />
                                    <div className='order-summary-align-service-fee'>
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
                            <div style={{ display: 'flex' }}>
                                <Image className='order-padlock-icon' height='44px' src='/assets/images/padlock.png' />
                                {/* <Icon floated='left' name='protect' color='#36af75' /> */}
                                <Header className='order-billing-header'>
                                    <div>Billing Information
                                <div className='order-powered-by-stripe'>POWERED BY
                                <Image className='order-powered-by-stripe-image' height='28px' width='75px' src='/assets/images/stripe-logo-blue.png' />
                                        </div>
                                    </div>
                                </Header>
                            </div>
                            <Divider />
                            <Checkout onRef={ref => (this.checkout = ref)} onBlur={() => {
                                if (this.state.hasErrors.payment) {
                                    this.setState({ hasErrors: { payment: false } });
                                }
                            }} />
                            <Message header={this.state.paymentError} icon='exclamation circle'
                                error={this.state.hasErrors.payment}
                                hidden={!this.state.hasErrors.payment}
                                visible={this.state.hasErrors.payment} />
                        </Segment>
                        <div>
                            <Button floated='left' className='order-back-button' size='huge' icon
                                onClick={() => {
                                    if (this.state.currentStep > Steps.pickup) {
                                        this.setState({ currentStep: this.state.currentStep - 1 });
                                    }
                                }}>
                                <Icon name='left arrow' />
                            </Button>
                        </div>
                        <div>
                            <div style={{ marginTop: '20px' }}>
                                <Button
                                    className='order-confirm-continue-button'
                                    fluid
                                    loading={this.state.orderProcessing}
                                    disabled={!this.state.acceptedTerms}
                                    onClick={() => this.handleOrderButtonClick()}>
                                    <Icon name='lock' /> Confirm and Pay
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
        }
        else if (this.state.currentStep === Steps.confirm) {
            currentStepComponent =
                <div>
                    This is how we do confirm
                    <Divider />

                    <Header>My Order Summary</Header>

                    <Segment style={{ maxWidth: '400px', minWidth: '250px' }}>
                        {this.state.quantity} {food.title}
                        <Form.Field>
                            <div style={{ marginTop: '3px' }}> Order type: <strong>{this.state.contactMethod}</strong> </div>
                        </Form.Field>
                        <Divider />
                        <div style={{ marginTop: '3px' }}> <strong>Total (CAD): ${PriceCalc.getTotal(food.price, this.state.quantity)}</strong></div>
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
                                        {this.state.quantity} x ${food.price} {food.title}
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


                    {this.state.order_id &&
                        <Button
                            className='order-confirm-continue-button'
                            fluid
                            loading={this.state.orderProcessing}
                            onClick={() => this.handleConfirmButtonClick()}>
                            <Icon name='lock' /> Submit Payment
                        </Button>
                    }

                </div>
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
                                        {this.state.quantity} x ${food.price} {food.title}
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
                    {/* <div className='order-navigation-header'>
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
                        
                    </div> */}
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
                                    <Step.Title>Done</Step.Title>
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

    handleError(ex) {
        console.error(ex);
        let paymentError = 'Payment failed.'
        if (ex.error && ex.error.message) {
            paymentError = ex.error.message;
        }
        else if (ex.response && ex.response.data && ex.response.data.error) {
            paymentError = ex.response.data.error;
        }
        this.setState({
            orderProcessing: false,
            hasErrors: { payment: true },
            paymentError
        });
    }

    handleConfirmButtonClick() {
        if (this.state.orderProcessing) {
            console.log('Confirmation is already processing...');
            return;
        }

        console.log('Confirmation processing');
        this.setState({ orderProcessing: true });

        ApiClient.confirmFoodOrder(null, this.state.order_id)
            .then(response => {
                console.log('Confirmation finished');
                console.log(response);
                this.setState({ orderProcessing: false });
            })
            .catch(ex => {
                this.handleError(ex);
            });
    }

    handleOrderButtonClick() {
        if (this.state.orderProcessing) {
            console.log('Order is already processing...');
            return;
        }

        if (!this.validatePaymentStep()) {
            console.log('Order form validation failed.  Please correct your information and try again.');
            return;
        }

        const jwtToken = CognitoUtil.getLoggedInUserJwtToken();
        if (!jwtToken) {
            console.error('Cannot submit order without a logged-in user.  Please log in and try again.');
            return;
        }

        console.log('Order processing');
        this.setState({ orderProcessing: true });

        const food = this.food;
        const payment = PriceCalc.getOrderPayment(food.price, this.state.quantity);
        const order = {
            food_id: food.food_id,
            cook_js_user_id: food.user_id,
            quantity: this.state.quantity,
            handoff_date: this.state.date,
            handoff_time: this.state.time,
            phone: this.state.phone,
            totalAmount: payment.totalAmount,
            cookAmount: payment.cookAmount
        };
        console.log(order);
        this.checkout.props.stripe.createSource(
            {
                amount: order.amount,
                currency: 'cad',
                usage: 'single_use',
                metadata: {
                    user_id: CognitoUtil.getLoggedInUserId()
                }
            })
            .then(result => {
                if (result.error) {
                    let ex = new Error('Payment failed!');
                    ex.error = result.error;
                    throw ex;
                }
                order.source = result.source;
                return ApiClient.submitFoodOrder(jwtToken, order);
            })
            .then(response => {
                console.log('Order finished');
                console.log(response);
                this.setState({
                    orderProcessing: false,
                    order_id: response.data.order_id
                });
                if (this.state.currentStep < Steps.confirm + 1) {
                    this.setState({ currentStep: this.state.currentStep + 1 });
                }
            })
            .catch(ex => {
                this.handleError(ex);
            });
    }
}