import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, formValueSelector } from 'redux-form'
import { Actions, Selectors } from '../../store/order'
import { Selectors as CurrentUserSelectors } from '../../store/currentUser'
import PropTypes from 'prop-types'
import { Button, Icon, Checkbox, Segment, Message } from 'semantic-ui-react'
import './index.css'
import { Constants } from '../../Constants'
import OrderHeader from '../../components/OrderHeader'
import PriceCalc from '../../services/PriceCalc'
import Util from '../../services/Util'
import Url from '../../services/Url'
import OrderSummary from './OrderSummary'
import ContactInfo from './ContactInfo'
import BillingInfo from './BillingInfo'
import { ContactMethods } from '../../Enums';

class Order extends React.Component {

    state = {
        acceptedTerms: false,
        billing: {},
        formErrors: {},
        formErrorList: []
    };

    componentWillMount() {
        let food_id = this.props.match.params.id;

        // If an order has already been submitted in the current session,
        // the user needs to start over by making a food request
        if (this.props.order_id) {
            this.props.history.push(Url.foodDetail(food_id));
            this.redirecting = true;
            return;
        }

        // Validate the order here.  If no date, time, quantity has been selected then bail.
        // The user most likely navigated directly to this order page.
        const { date, time, quantity } = this.props;
        if (date == null || time == null || quantity == null) {
            this.props.history.push(Url.foodDetail(food_id));
            this.redirecting = true;
            return;
        }

        if (!this.props.food) {
            this.props.actions.loadFood(food_id)
                .then(() => {
                    document.title = this.props.food.title;
                });
        }
        else {
            document.title = this.props.food.title;
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isOrderCompleted) {
            let food_id = this.props.match.params.id;
            this.props.history.push(Url.foodOrderSuccess(food_id));
            this.redirecting = true;
        }

        if (this.props.contactMethod !== nextProps.contactMethod) {
            this.props.actions.contactMethodChanged(nextProps.contactMethod);
        }

        if (this.props.currentUser !== nextProps.currentUser) {
            if (!this.props.buyerPhone && !nextProps.buyerPhone) {
                this.props.change('buyerPhone', nextProps.currentUser.phone);
            }
        }

        if (this.props.buyerPhone !== nextProps.buyerPhone) {
            this.props.actions.buyerPhoneChanged(nextProps.buyerPhone);
        }

        if (this.props.buyerAddress !== nextProps.buyerAddress) {
            this.props.actions.buyerAddressChanged(nextProps.buyerAddress);
        }
    }

    handleOrderButtonClick = () => {
        const { isOrderProcessing, touch } = this.props;

        if (isOrderProcessing) {
            console.log('Order is already processing...');
            return;
        }

        // In case the user hasn't tried filling in the forms at all,
        // we need to simulat that here.
        touch('buyerPhone');
        touch('buyerAddress');
        touch('contactMethod');

        if (!this.canSubmitOrder(true)) {
            console.log('Order form validation failed.  Please correct your information and try again.');
            this.setState({ showErrorSummary: true });
            return;
        }

        const { billing } = this.state;
        const cardName = billing.values.cardName.value;
        this.props.actions.submitOrder(this.checkout.props.stripe, cardName, this.createOrderPayload());
    }

    canSubmitOrder(isValidating = false) {
        const { acceptedTerms, billing } = this.state;
        const { isOrderProcessing, valid } = this.props;

        if (!acceptedTerms || (!isValidating && isOrderProcessing))
            return false;

        if (!valid) {
            return false;
        }

        if (!billing.valid) {
            return false;
        }

        return true;
    }

    createOrderPayload() {
        const { currentUser } = this.props;
        const { food, quantity, time, pickup, contactMethod, buyerPhone, buyerEmail, buyerAddress } = this.props;

        const paymentAmount = PriceCalc.getPaymentAmount(food, quantity, pickup);
        const order = {
            food_id: food.food_id,
            cook_user_id: food.user_id,
            buyer_user_id: currentUser.user_id,
            buyer_phone: buyerPhone,
            buyer_email: buyerEmail,
            buyer_address: buyerAddress,
            delivery_option: pickup ? 'pickup' : 'delivery',
            quantity: quantity,
            handoff_start_date: time.handoff_start_date.toISOString(),
            handoff_end_date: time.handoff_end_date.toISOString(),
            contact_method: contactMethod,
            amount: paymentAmount
        };
        return order;
    }

    handleCheckoutRef = (ref) => {
        this.checkout = ref;
    }

    validateBillingInfo = (values) => {
        const errors = [];

        if (values.cardNumber.error) {
            errors.push({ header: 'Card number is invalid', message: values.cardNumber.error.message });
        }
        else if (!values.cardNumber.complete) {
            errors.push({ header: 'Card number is required', message: 'Please enter your card number' });
        }

        if (values.cardExpiry.error) {
            errors.push({ header: 'Card expiry is invalid', message: values.cardExpiry.error.message });
        }
        else if (!values.cardExpiry.complete) {
            errors.push({ header: 'Card expiry is required', message: 'Please enter your card expiry date' });
        }

        if (values.cardCvc.error) {
            errors.push({ header: 'Card security code is invalid', message: values.cardCvc.error.message });
        }
        else if (!values.cardCvc.complete) {
            errors.push({ header: 'Card security code is required', message: 'Please enter your card security code' });
        }

        if (!values.cardName.complete) {
            errors.push({ header: 'Card name is required', message: 'Please enter the name as it appears on your card' });
        }

        if (values.postalCode.error) {
            errors.push({ header: 'Card postal code is invalid', message: values.postalCode.error.message });
        }
        else if (!values.postalCode.complete) {
            errors.push({ header: 'Card postal code is required', message: 'Please enter your card postal code' });
        }

        const newState = {
            billing: {
                invalid: errors.length > 0,
                valid: errors.length === 0,
                values: values,
                errors: errors
            }
        };

        this.setState(newState);
    }

    getBillingErrors() {
        const { billing } = this.state;
        return billing.errors ? billing.errors : [];
    }

    getContactErrors() {
        const { pickup, buyerAddress, buyerPhone, contactMethod } = this.props;
        const errors = validate({ pickup, buyerAddress, buyerPhone, contactMethod });

        const contactErrors = [];
        for (const elementKey in errors) {
            const error = errors[elementKey];
            contactErrors.push(error);
        }

        return contactErrors;
    }

    render() {
        if (this.redirecting) {
            return null;
        }

        const { food, pickup, quantity, date, time, contactMethod, buyerPhone,
            isOrderProcessing, paymentError } = this.props;
        if (!food) {
            return null;
        }

        const { acceptedTerms, showErrorSummary } = this.state;
        const billingErrors = this.getBillingErrors();
        const contactErrors = this.getContactErrors();

        return (
            <div className='order-all'>
                <OrderHeader fixed />
                <div className='order-body'>
                    <div className='order-container'>
                        <div className='order-right'>
                            <div>
                                <OrderSummary food={food} pickup={pickup} quantity={quantity} date={date} time={time} />
                            </div>
                        </div>
                        <div className='order-container-width'>
                            <ContactInfo pickup={pickup} contactMethod={contactMethod} buyerPhone={buyerPhone} />

                            <BillingInfo onCheckoutRef={this.handleCheckoutRef}
                                onBillingInfoChange={this.validateBillingInfo} />

                            {showErrorSummary && contactErrors.length > 0 &&
                                <Message error>
                                    <Message.Header>Contact Information Missing</Message.Header>
                                    <Message.List>
                                        {contactErrors.map((err, index) => {
                                            return (<Message.Item key={index}>{err.message}</Message.Item>);
                                        })}
                                    </Message.List>
                                </Message>
                            }

                            {showErrorSummary && billingErrors.length > 0 &&
                                <Message error>
                                    <Message.Header>Billing Information Missing</Message.Header>
                                    <Message.List>
                                        {billingErrors.map((err, index) => {
                                            return (<Message.Item key={index}>{err.message}</Message.Item>);
                                        })}
                                    </Message.List>
                                </Message>
                            }

                            {paymentError &&
                                <Message error header='Order Processing Error' icon='exclamation circle'
                                    content={paymentError} />
                            }

                            <Segment>
                                <Checkbox className='order-segment-user-agree-text'
                                    label="I am over the age of 18 and I agree to this site's user and customer refund policies."
                                    onChange={() => this.setState({ acceptedTerms: !acceptedTerms })}
                                    checked={acceptedTerms} />
                            </Segment>

                            <Button animated='fade' fluid className='order-confirm-continue-button'
                                disabled={!acceptedTerms}
                                loading={isOrderProcessing}
                                onClick={this.handleOrderButtonClick}>
                                <Button.Content visible>
                                    <Icon name='lock' />Confirm and Pay
                                </Button.Content>
                                <Button.Content hidden>
                                    <Icon name='lock' />${PriceCalc.getTotal(food.price, quantity)} {Constants.Currency}
                                </Button.Content>
                            </Button>

                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

const validate = (values) => {
    const errors = {}

    if (values.contactMethod === ContactMethods.phone) {
        if (!values.buyerPhone) {
            errors.buyerPhone = { header: 'Phone is required', message: 'Please enter your phone number' };
        }
        else if (!Util.validatePhoneNumber(values.buyerPhone)) {
            errors.buyerPhone = { header: 'Invalid phone number', message: 'Please enter your phone number' };
        }
    }

    if (!values.pickup) {
        if (!values.buyerAddress) {
            errors.buyerAddress = { header: 'Delivery address is required', message: 'Please enter your delivery address' };
        }
    }

    return errors;
}

const formSelector = formValueSelector('order');
const mapStateToProps = (state) => {
    return {
        currentUser: CurrentUserSelectors.currentUser(state),
        food: Selectors.food(state),
        cook: Selectors.cook(state),
        isFoodLoading: Selectors.isFoodLoading(state),
        isCookLoading: Selectors.isCookLoading(state),
        pickup: Selectors.pickup(state),
        date: Selectors.date(state),
        time: Selectors.time(state),
        quantity: Selectors.quantity(state),

        // buyerPhone: Selectors.buyerPhone(state),
        // buyerAddress: Selectors.buyerAddress(state),
        // contactMethod: Selectors.contactMethod(state),
        buyerPhone: formSelector(state, 'buyerPhone'),
        buyerAddress: formSelector(state, 'buyerAddress'),
        contactMethod: formSelector(state, 'contactMethod'),

        isOrderProcessing: Selectors.isOrderProcessing(state),
        isOrderCompleted: Selectors.isOrderCompleted(state),
        paymentError: Selectors.paymentError(state),
        order_id: Selectors.order_id(state),
        initialValues: {
            pickup: Selectors.pickup(state),
            buyerAddress: Selectors.buyerAddress(state),
            buyerPhone: Selectors.buyerPhone(state),
            contactMethod: Selectors.contactMethod(state),
        },
    };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};

Order.propTypes = {
    currentUser: PropTypes.object,
    food: PropTypes.shape({
        food_id: PropTypes.string.isRequired,
    }),
    cook: PropTypes.shape({
        user_id: PropTypes.string.isRequired,
    }),
    isFoodLoading: PropTypes.bool,
    isCookLoading: PropTypes.bool,
    pickup: PropTypes.bool.isRequired,
    date: PropTypes.object,
    time: PropTypes.shape({
        handoff_start_date: PropTypes.object,
        handoff_end_date: PropTypes.object
    }),
    quantity: PropTypes.number.isRequired,
    contactMethod: PropTypes.string,
    buyerPhone: PropTypes.string,
    buyerAddress: PropTypes.string,
    paymentError: PropTypes.string,
    isOrderProcessing: PropTypes.bool,
    isOrderCompleted: PropTypes.bool,
    order_id: PropTypes.string,

    actions: PropTypes.shape({
        loadFood: PropTypes.func.isRequired,
        loadCook: PropTypes.func.isRequired,
        loadReviews: PropTypes.func.isRequired,
        contactMethodChanged: PropTypes.func.isRequired,
        buyerPhoneChanged: PropTypes.func.isRequired,
        buyerAddressChanged: PropTypes.func.isRequired,
        submitOrder: PropTypes.func.isRequired,
    }).isRequired
}

const form = reduxForm({ form: 'order', validate })(Order);
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(form));
