import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Button, Icon, Checkbox, Segment, Message } from 'semantic-ui-react'
import './index.css'
import OrderHeader from '../../components/OrderHeader'
import CognitoUtil from '../../services/Cognito/CognitoUtil'
import PriceCalc from '../../services/PriceCalc'
import Url from '../../services/Url'
import { Actions, Selectors } from '../../store/order'
import OrderSummary from './OrderSummary'
import ContactInfo from './ContactInfo'
import BillingInfo from './BillingInfo'
import ContactMethods from '../../data/ContactMethods';

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
        const { isOrderProcessing, buyerAddress, isBuyerAddressValid, isBuyerPhoneValid, pickup, contactMethod } = this.props;

        if (!acceptedTerms || (!isValidating && isOrderProcessing))
            return false;

        if (!pickup && (!isBuyerAddressValid || !buyerAddress))
            return false;

        if (contactMethod === ContactMethods.phone && !isBuyerPhoneValid)
            return false;

        if (!nameOnCard) {
            return false;
        }

        return true;
    }

    createOrderPayload() {
        const { food, quantity, date, time, pickup, contactMethod, buyerPhone, buyerEmail, buyerAddress } = this.props;

        const paymentAmount = PriceCalc.getPaymentAmount(food, quantity, pickup);
        const order = {
            food_id: food.food_id,
            cook_user_id: food.user_id,
            buyer_phone: buyerPhone,
            buyer_email: buyerEmail,
            buyer_address: buyerAddress,
            pickup: pickup,
            quantity: quantity,
            handoff_date: date.toISOString(),
            handoff_time: time,
            contact_method: contactMethod,
            amount: paymentAmount
        };
        return order;
    }

    handleContactMethodChange = (contactMethod) => {
        this.props.actions.contactMethodChanged(contactMethod);
    }

    handlePhoneNumberChange = (e) => {
        this.props.actions.buyerPhoneChanged(e.target.value);
    }

    handleAddressSelected = (place) => {
        const value = place.formatted_address;
        this.props.actions.buyerAddressChanged(value);
    }

    handleAddressChange = (e) => {
        this.props.actions.buyerAddressChanged(e.target.value);
    }

    handlePhoneNumberBlur = () => {
        this.props.actions.buyerPhoneChanged(this.props.buyerPhone);
    }

    handleAddressBlur = () => {
        this.props.actions.buyerAddressChanged(this.props.buyerAddress);
    }

    handleCheckoutRef = ref => this.checkout = ref;
    handleCardNameChange = e => this.setState({ nameOnCard: e.target.value });

    render() {
        if (this.redirecting) {
            return null;
        }

        const { food, pickup, quantity, date, time, contactMethod,
            buyerPhone, isBuyerPhoneValid,
            buyerAddress, isBuyerAddressValid,
            isOrderProcessing, paymentError
        } = this.props;

        if (!food) {
            return null;
        }
        const { acceptedTerms } = this.state;
        const hasPaymentError = paymentError ? true : false;

        return (
            <div>
                <OrderHeader fixed />
                <div className='order-body'>
                    <div className='order-container'>
                        <div className='order-right'>
                            <div>
                                <OrderSummary food={food} pickup={pickup} quantity={quantity} date={date} time={time} />
                            </div>
                        </div>
                        <div>
                            <ContactInfo
                                pickup={pickup}

                                contactMethod={contactMethod}
                                onContactMethodChange={this.handleContactMethodChange}

                                buyerPhone={buyerPhone}
                                isBuyerPhoneValid={isBuyerPhoneValid}
                                onPhoneNumberChange={this.handlePhoneNumberChange}
                                onPhoneNumberBlur={this.handlePhoneNumberBlur}

                                buyerAddress={buyerAddress}
                                isBuyerAddressValid={isBuyerAddressValid}
                                onAddressChange={this.handleAddressChange}
                                onAddressSelected={this.handleAddressSelected}
                                onAddressBlur={this.handleAddressBlur}
                            />

                            <BillingInfo paymentError={paymentError}
                                onCheckoutRef={this.handleCheckoutRef}
                                onCardNameChange={this.handleCardNameChange} />

                            <Segment>
                                <Checkbox className='order-segment-user-agree-text'
                                    label="I agree to this site's user and customer refund policy and that I am over the age of 18. I also agree to pay the total amount shown, which includes service fees."
                                    onChange={() => this.setState({ acceptedTerms: !acceptedTerms })}
                                    checked={acceptedTerms} />
                            </Segment>

                            <Message header='Order Processing Error' icon='exclamation circle'
                                content={paymentError}
                                error={hasPaymentError}
                                hidden={!hasPaymentError}
                                visible={hasPaymentError} />

                            <Button fluid className='order-confirm-continue-button'
                                disabled={!this.canSubmitOrder()}
                                loading={isOrderProcessing}
                                onClick={this.handleOrderButtonClick}>
                                <Icon name='lock' />Confirm and Pay
                            </Button>
                        </div>
                    </div>
                </div>
            </div >
        );
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
        buyerPhone: Selectors.buyerPhone(state),
        isBuyerPhoneValid: Selectors.isBuyerPhoneValid(state),
        buyerAddress: Selectors.buyerAddress(state),
        isBuyerAddressValid: Selectors.isBuyerAddressValid(state),
        contactMethod: Selectors.contactMethod(state),
        isOrderProcessing: Selectors.isOrderProcessing(state),
        isOrderCompleted: Selectors.isOrderCompleted(state),
        paymentError: Selectors.paymentError(state),
        order_id: Selectors.order_id(state),
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
    contactMethod: PropTypes.number,
    buyerPhone: PropTypes.string,
    isBuyerPhoneValid: PropTypes.bool.isRequired,
    buyerAddress: PropTypes.string,
    isBuyerAddressValid: PropTypes.bool.isRequired,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Order));
