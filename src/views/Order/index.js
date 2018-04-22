import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, formValueSelector } from 'redux-form'
import PropTypes from 'prop-types'
import { Button, Icon, Checkbox, Segment, Message } from 'semantic-ui-react'
import './index.css'
import { Constants } from '../../Constants'
import OrderHeader from '../../components/OrderHeader'
import CognitoUtil from '../../services/Cognito/CognitoUtil'
import PriceCalc from '../../services/PriceCalc'
import Util from '../../services/Util'
import Url from '../../services/Url'
import { Actions, Selectors } from '../../store/order'
import OrderSummary from './OrderSummary'
import ContactInfo from './ContactInfo'
import BillingInfo from './BillingInfo'
import { ContactMethods } from '../../Enums';

class Order extends React.Component {

    state = { acceptedTerms: false };

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

        if (this.props.buyerPhone !== nextProps.buyerPhone) {
            this.props.actions.buyerPhoneChanged(nextProps.buyerPhone);
        }

        if (this.props.buyerAddress !== nextProps.buyerAddress) {
            this.props.actions.buyerAddressChanged(nextProps.buyerAddress);
        }
    }

    handleOrderButtonClick = () => {
        const { isOrderProcessing } = this.props;

        if (isOrderProcessing) {
            console.log('Order is already processing...');
            return;
        }

        if (!this.validateSubmitOrder()) {
            console.log('Order form validation failed.  Please correct your information and try again.');
            return;
        }

        const jwtToken = CognitoUtil.getLoggedInUserJwtToken();
        if (!jwtToken) {
            console.log('Cannot submit order without a logged-in user.  Please log in and try again.');
            return;
        }

        const { nameOnCard } = this.state;
        this.props.actions.submitOrder(this.checkout.props.stripe, nameOnCard, this.createOrderPayload());
    }

    validateSubmitOrder() {
        return this.canSubmitOrder(true);
    }

    canSubmitOrder(isValidating = false) {
        const { acceptedTerms, nameOnCard } = this.state;
        const { isOrderProcessing, valid } = this.props;

        if (!acceptedTerms || (!isValidating && isOrderProcessing))
            return false;

        if (!valid) {
            return false;
        }

        if (!nameOnCard) {
            return false;
        }

        return true;
    }

    createOrderPayload() {
        const { food, quantity, time, pickup, contactMethod, buyerPhone, buyerEmail, buyerAddress } = this.props;

        const paymentAmount = PriceCalc.getPaymentAmount(food, quantity, pickup);
        const order = {
            food_id: food.food_id,
            cook_user_id: food.user_id,
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

    handleCardNameChange = (e) => {
        this.setState({ nameOnCard: e.target.value });
    }

    render() {
        if (this.redirecting) {
            return null;
        }

        const { food, pickup, quantity, date, time, contactMethod,
            isOrderProcessing, paymentError
        } = this.props;

        if (!food) {
            return null;
        }
        const { acceptedTerms } = this.state;
        const hasPaymentError = paymentError ? true : false;

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
                            <ContactInfo pickup={pickup} contactMethod={contactMethod} />

                            <BillingInfo paymentError={paymentError}
                                onCheckoutRef={this.handleCheckoutRef}
                                onCardNameChange={this.handleCardNameChange} />

                            <Segment>
                                <Checkbox className='order-segment-user-agree-text'
                                    label="I am over the age of 18 and I agree to this site's user and customer refund policies."
                                    onChange={() => this.setState({ acceptedTerms: !acceptedTerms })}
                                    checked={acceptedTerms} />
                            </Segment>

                            <Message header='Order Processing Error' icon='exclamation circle'
                                content={paymentError}
                                error={hasPaymentError}
                                hidden={!hasPaymentError}
                                visible={hasPaymentError} />

                            <Button animated='fade' fluid className='order-confirm-continue-button'
                                disabled={!this.canSubmitOrder()}
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
        }
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
