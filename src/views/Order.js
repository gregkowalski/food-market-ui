import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { parse as parsePhone, asYouType as asYouTypePhone } from 'libphonenumber-js'
import { Button, Image, Icon, Message, Dropdown, Checkbox, Radio } from 'semantic-ui-react'
import { Accordion, Header, Divider, Form, Segment, Input, Step, Grid } from 'semantic-ui-react'
import './Order.css'
import OrderHeader from '../components/OrderHeader'
import Checkout from '../components/Stripe/Checkout'
import ApiClient from '../services/ApiClient'
import CognitoUtil from '../services/Cognito/CognitoUtil'
import PriceCalc from '../services/PriceCalc'
import Util from '../services/Util'
import Constants from '../Constants'
import { Actions, Selectors } from '../store/order'
import OrderTimes from '../data/OrderTimes'

const Steps = {
    pickup: 0,
    billing: 1,
    confirm: 2
}

const ContactMethods = {
    email: 0,
    phone: 1
}

class Order extends React.Component {

    state = {
        quantity: 1,
        acceptedTerms: false,
        hasBlurred: {},
        hasErrors: {},
        contactMethod: ContactMethods.email,
        currentStep: Steps.pickup,
        time: 0
    };

    componentWillMount() {
        if (!CognitoUtil.isLoggedIn()) {
            CognitoUtil.setLastPath(window.location.pathname);
            CognitoUtil.redirectToLoginIfNoSession();
            return;
        }

        // Validate the order here.  If no date, time, quantity has been selected then bail.

        let food_id = this.props.match.params.id;
        this.props.actions.loadFood(food_id)
            .then(() => {
                document.title = this.props.food.title;
                return this.props.actions.loadCook(this.props.food.user_id);
            });
    }

    handleContactMethodChange = (e, { value }) => {
        this.setState({ contactMethod: value });
    }

    handleAddressChange(place) {
        const value = place.formatted_address;
        this.setState({ address: value }, () => this.validateField('address', value))
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

    handleError = (ex) => {
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

    handleConfirmButtonClick = () => {
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

    handleOrderButtonClick = () => {
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

    render() {
        const { food, cook, pickup, quantity, date, time, buyerPhone } = this.props;
        if (!food) {
            return null;
        }

        const { contactMethod, acceptedTerms, currentStep, orderProcessing } = this.state;

        let currentStepComponent;
        if (currentStep === Steps.pickup) {
            currentStepComponent = (
                <ReviewStep
                    food={food}
                    pickup={pickup}
                    quantity={quantity}
                    date={date}
                    time={time}
                    contactMethod={contactMethod}
                    buyerPhone={buyerPhone}
                    acceptedTerms={acceptedTerms}
                    hasErrors={this.state.hasErrors}
                    onContactMethodChange={this.handleContactMethodChange}
                    onPhoneNumberChange={this.handlePhoneNumberChange}
                    onPhoneNumberBlur={this.handleContactInfoBlur}
                    onNextStepClick={this.handlePickupStepContinueClick}
                    onAcceptTermsChange={() => this.setState({ acceptedTerms: !acceptedTerms })}

                    paymentError={this.state.paymentError}
                    onBackButtonClick={() => {
                        if (currentStep > Steps.pickup) {
                            this.setState({ currentStep: currentStep - 1 });
                        }
                    }}
                    onCheckoutBlur={() => {
                        if (this.state.hasErrors.payment) {
                            this.setState({ hasErrors: { payment: false } });
                        }
                    }}
                    onOrderButtonClick={this.handleConfirmButtonClick}
                    onCheckoutRef={(ref) => (this.checkout = ref)}
                />
            );
        }
        else if (currentStep === Steps.billing) {
            currentStepComponent = (
                <BillingStep
                    food={food}
                    pickup={pickup}
                    quantity={quantity}
                    date={date}
                    time={time}
                    hasErrors={this.state.hasErrors}
                    paymentError={this.state.paymentError}
                    onBackButtonClick={() => {
                        if (currentStep > Steps.pickup) {
                            this.setState({ currentStep: currentStep - 1 });
                        }
                    }}
                    onCheckoutBlur={() => {
                        if (this.state.hasErrors.payment) {
                            this.setState({ hasErrors: { payment: false } });
                        }
                    }}
                    onOrderButtonClick={this.handleConfirmButtonClick}
                    onCheckoutRef={(ref) => (this.checkout = ref)}
                />
            );
        }
        else if (currentStep === Steps.confirm) {
            const { order_id } = this.state;
            currentStepComponent = (
                <ConfirmStep
                    food={food}
                    quantity={quantity}
                    orderProcessing={orderProcessing}
                    contactMethod={contactMethod}
                    order_id={order_id}
                    onConfirmOrderButtonClick={this.handleConfirmButtonClick}
                />
            )
        }

        return (
            <div>
                <OrderHeader fixed />
                <div className='order-body'>
                    <div className='order-step-header'>
                        <Step.Group unstackable widths={3}>
                            <Step active={currentStep === Steps.pickup}
                                completed={currentStep > Steps.pickup}
                                disabled={currentStep < Steps.pickup}
                                className='order-step-boxes'>
                                {/* <Icon name='shopping basket' /> */}
                                <Step.Content>
                                    <Step.Title>Review</Step.Title>
                                </Step.Content>
                            </Step>
                            <Step active={currentStep === Steps.billing}
                                completed={currentStep > Steps.billing}
                                disabled={currentStep < Steps.billing}
                                className='order-step-boxes'>
                                {/* <Icon name='credit card' /> */}
                                <Step.Content>
                                    <Step.Title>Payment</Step.Title>
                                </Step.Content>
                            </Step>
                            <Step active={currentStep === Steps.confirm}
                                completed={currentStep > Steps.confirm}
                                disabled={currentStep < Steps.confirm}
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
}


const mapStateToProps = (state) => {
    return {
        food: Selectors.food(state),
        cook: Selectors.cook(state),
        isFoodLoading: Selectors.isFoodLoading(state),
        isCookLoading: Selectors.isCookLoading(state),
        pickup: Selectors.pickup(state),
        date: Selectors.date(state),
        time: Selectors.time(state),
        quantity: Selectors.quantity(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};

Order.propTypes = {
    food: PropTypes.shape({
        food_id: PropTypes.string.isRequired,
    }),
    cook: PropTypes.shape({
        user_id: PropTypes.string.isRequired,
    }),
    isFoodLoading: PropTypes.bool.isRequired,
    isCookLoading: PropTypes.bool.isRequired,
    pickup: PropTypes.bool.isRequired,
    date: PropTypes.object,
    time: PropTypes.number,
    quantity: PropTypes.number.isRequired,
    buyerPhone: PropTypes.string,

    actions: PropTypes.shape({
        loadFood: PropTypes.func.isRequired,
        loadCook: PropTypes.func.isRequired,
        loadReviews: PropTypes.func.isRequired,
    }).isRequired

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Order));

























const OrderSummary = ({ food, pickup, quantity, date, time }) => {
    return (
        <Segment padded raised>
            <Header className='order-detail-summary-left-header'>
                <Icon name='shopping basket' /> My Order</Header>
            <Divider />
            <div className='order-card-header'>
                <Image floated='right' style={{ marginTop: '5px 0px 0px 15px' }} src={food.imageUrls[0]} height='auto' width='26%' />
                <div className='order-card-header-overflow'>{food.title} </div>
            </div>
            <Divider />

            <div className='detail-card-summary-row'>
                <div>Delivery Option:</div>
                <div>{pickup ? 'Pickup' : 'Delivery'}</div>
            </div>

            <div className='detail-card-summary-row'>
                <div>Date:</div>
                <div>{date.format('MMMM D, YYYY')}</div>
            </div>
            <div className='detail-card-summary-row'>
                <div>Time:</div>
                <div>{OrderTimes[time].text}</div>
            </div>

            <div className='detail-card-summary-row'>
                <div>${food.price} x {quantity} order size</div>
                <div>${PriceCalc.getTotal(food.price, quantity)}</div>
            </div>
            <Divider />
            {!pickup &&
                <div className='detail-card-summary-row'>
                    <div>Delivery</div>
                    <div>${Constants.DeliveryFee}</div>
                </div>
            }
            {!pickup &&
                <Divider />
            }
            <div className='detail-card-summary-row large-font'>
                <div>Total</div>
                <div>${PriceCalc.getTotalPrice(food, quantity, pickup)}</div>
            </div>

        </Segment>
    );
}

const ReviewStep = ({ food, pickup, quantity, date, time, contactMethod, acceptedTerms, buyerPhone, hasErrors,
    onContactMethodChange, onPhoneNumberChange, onPhoneNumberBlur, onNextStepClick, onAcceptTermsChange,
    orderProcessing, onOrderButtonClick, onBackButtonClick, onCheckoutBlur, onCheckoutRef, paymentError }) => {
    return (
        <div className='order-detail-summary-container'>
            <div className='order-detail-summary-left'>
                <OrderSummary food={food} pickup={pickup} quantity={quantity} date={date} time={time} />
            </div>
            <div className='order-detail-summary-right'>
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
                                            checked={contactMethod === ContactMethods.email}
                                            onChange={onContactMethodChange}
                                        />
                                    </Form.Field>
                                    <Form.Field className='order-segment-contact-option'>
                                        <Radio
                                            label='Phone (optional)'
                                            name='contactMethodRadioGroup'
                                            value={ContactMethods.phone}
                                            checked={contactMethod === ContactMethods.phone}
                                            onChange={onContactMethodChange}
                                        />
                                    </Form.Field>
                                </Form>
                                <div className='order-contact-phone-input'>
                                    <Input name='phone' type='tel' placeholder='604 456 7890' value={buyerPhone}
                                        disabled={contactMethod !== ContactMethods.phone}
                                        onChange={onPhoneNumberChange} onBlur={onPhoneNumberBlur} />
                                    <Message header='Invalid phone number' content='Please enter your phone number' icon='exclamation circle'
                                        error={hasErrors.phone}
                                        hidden={contactMethod !== ContactMethods.phone || !hasErrors.phone}
                                        visible={contactMethod === ContactMethods.phone && hasErrors.phone} />
                                </div>
                            </Grid.Column>
                            <Grid.Column>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <Segment padded>
                    <div style={{ display: 'flex' }}>
                        <Image className='order-padlock-icon' height='44px' src='/assets/images/padlock.png' />
                        <Header className='order-billing-header'>
                            <div>Billing Information
                                <div className='order-powered-by-stripe'>POWERED BY
                                    <Image className='order-powered-by-stripe-image' height='28px' width='75px' src='/assets/images/stripe-logo-blue.png' />
                                </div>
                            </div>
                        </Header>
                    </div>
                    <Divider />
                    <Checkout onRef={onCheckoutRef} onBlur={onCheckoutBlur} />
                    <Message header={paymentError} icon='exclamation circle'
                        error={hasErrors.payment}
                        hidden={!hasErrors.payment}
                        visible={hasErrors.payment} />
                </Segment>
                <div>
                    <Button floated='left' className='order-back-button' size='huge' icon onClick={onBackButtonClick}>
                        <Icon name='left arrow' />
                    </Button>
                </div>
                <Segment padded='very'>
                    <Checkbox className='order-segment-user-agree-text'
                        label="I agree to this site's user and customer refund policy and that I am over the age of 18. I also agree to pay the total amount shown, which includes service fees."
                        onChange={onAcceptTermsChange}
                        checked={acceptedTerms} />
                </Segment>

                <div>
                    <div style={{ marginTop: '20px' }}>
                        <Button
                            className='order-confirm-continue-button'
                            fluid
                            loading={orderProcessing}
                            disabled={!acceptedTerms}
                            onClick={onOrderButtonClick}>
                            <Icon name='lock' /> Confirm and Pay
                        </Button>
                    </div>
                </div>
                {/* <div>
                    <Button className='order-confirm-continue-button' floated='left' size='huge' icon
                        disabled={!acceptedTerms}
                        onClick={onNextStepClick}>
                        <Icon name='lock' /> Continue
                    </Button>
                </div> */}
            </div>
        </div>
    );
}

const BillingStep = ({ food, pickup, quantity, date, time, orderProcessing, acceptedTerms,
    onOrderButtonClick, onBackButtonClick, onCheckoutBlur, onCheckoutRef, hasErrors, paymentError }) => {
    return (
        <div className='order-detail-summary-container'>
            <div className='order-detail-summary-left-step-2'>
                <OrderSummary food={food} pickup={pickup} quantity={quantity} date={date} time={time} />
            </div>
            <div className='order-detail-summary-right'>
                <Segment padded>
                    <div style={{ display: 'flex' }}>
                        <Image className='order-padlock-icon' height='44px' src='/assets/images/padlock.png' />
                        <Header className='order-billing-header'>
                            <div>Billing Information
                                <div className='order-powered-by-stripe'>POWERED BY
                                    <Image className='order-powered-by-stripe-image' height='28px' width='75px' src='/assets/images/stripe-logo-blue.png' />
                                </div>
                            </div>
                        </Header>
                    </div>
                    <Divider />
                    <Checkout onRef={onCheckoutRef} onBlur={onCheckoutBlur} />
                    <Message header={paymentError} icon='exclamation circle'
                        error={hasErrors.payment}
                        hidden={!hasErrors.payment}
                        visible={hasErrors.payment} />
                </Segment>
                <div>
                    <Button floated='left' className='order-back-button' size='huge' icon onClick={onBackButtonClick}>
                        <Icon name='left arrow' />
                    </Button>
                </div>
                <div>
                    <div style={{ marginTop: '20px' }}>
                        <Button
                            className='order-confirm-continue-button'
                            fluid
                            loading={orderProcessing}
                            disabled={!acceptedTerms}
                            onClick={onOrderButtonClick}>
                            <Icon name='lock' /> Confirm and Pay
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ConfirmStep = ({ food, quantity, contactMethod, orderProcessing, order_id, onConfirmOrderButtonClick }) => {
    return (
        <div>
            This is how we do confirm
            <Divider />

            <Header>My Order Summary</Header>

            <Segment style={{ maxWidth: '400px', minWidth: '250px' }}>
                {quantity} {food.title}
                <Form.Field>
                    <div style={{ marginTop: '3px' }}> Order type: <strong>{contactMethod}</strong> </div>
                </Form.Field>
                <Divider />
                <div style={{ marginTop: '3px' }}> <strong>Total (CAD): ${PriceCalc.getTotal(food.price, quantity)}</strong></div>
            </Segment>

            <Divider />

            {order_id &&
                <Button
                    className='order-confirm-continue-button'
                    fluid
                    loading={orderProcessing}
                    onClick={onConfirmOrderButtonClick}>
                    <Icon name='lock' /> Submit Payment
                </Button>
            }
        </div>
    );
}