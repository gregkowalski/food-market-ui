import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import { reduxForm, formValueSelector } from 'redux-form'
import { Actions, Selectors, PayOptions, EmptyPayGuest } from '../../store/order'
import { Selectors as CurrentUserSelectors } from '../../store/currentUser'
import PropTypes from 'prop-types'
import { Button, Icon, Checkbox, Segment, Message } from 'semantic-ui-react'
import './index.css'
import { Constants } from '../../Constants'
import { DeliveryOptions } from '../../Enums'
import OrderHeader from '../../components/OrderHeader'
import PriceCalc from '../../services/PriceCalc'
import Util from '../../services/Util'
import Url from '../../services/Url'
import OrderSummary from './OrderSummary'
import ContactInfo from './ContactInfo'
import BillingInfo from './BillingInfo'
import PaymentInfo from './PaymentInfo'
import { ContactMethods } from '../../Enums'
import Dom from '../../Dom'
import DeliveryInfo from './DeliveryInfo'
import { Formik } from 'formik'
import FormikEffects from './FormikEffects'

class Order extends React.Component {

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
        if (!date || !time || !quantity) {
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

    handleCheckoutRef = (ref) => {
        this.checkout = ref;
    }

    render() {
        if (this.redirecting) {
            return null;
        }

        const { food, pickup, quantity, date, time, currentUser } = this.props;
        if (!food) {
            return null;
        }

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
                        <Formik initialValues={{
                            pickup: pickup,
                            acceptedTerms: false,
                            buyerAddress: currentUser.address ? currentUser.address : '',
                            payGuests: [Object.assign({}, EmptyPayGuest)],
                            currentUserPayGuest: Object.assign({}, EmptyPayGuest, { email: currentUser.email }),
                            payOption: PayOptions.full,
                            billing: {
                                cardNumber: {},
                                cardName: {},
                                cardExpiry: {},
                                cardCvc: {},
                                postalCode: {}
                            }
                        }}
                            onSubmit={this.submit}
                            validate={this.validate}
                            children={props => (
                                <OrderForm {...props}
                                    food={food}
                                    pickup={pickup}
                                    quantity={quantity}
                                    onCheckoutRef={this.handleCheckoutRef}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>
        );
    }

    submit = (values, actions) => {
        const cardName = values.billing.cardName.value;
        this.props.actions.submitOrder(this.checkout.props.stripe, cardName, this.createOrderPayload())
            .then(() => {
                actions.setSubmitting(false);
            })
            .catch(() => {
                actions.setSubmitting(false);
            });
    }

    createOrderPayload() {
        const { currentUser, food, quantity, time, pickup, contactMethod, buyerAddress } = this.props;

        const paymentAmount = PriceCalc.getPaymentAmount(food, quantity, pickup);
        const order = {
            food_id: food.food_id,
            cook_user_id: food.user_id,
            buyer_user_id: currentUser.user_id,
            // buyer_phone: buyerPhone,
            buyer_email: currentUser.email,
            buyer_address: buyerAddress,
            delivery_option: pickup ? DeliveryOptions.pickup : DeliveryOptions.delivery,
            quantity: quantity,
            handoff_start_date: time.handoff_start_date.toISOString(),
            handoff_end_date: time.handoff_end_date.toISOString(),
            contact_method: contactMethod,
            amount: paymentAmount
        };
        return order;
    }

    validate = (values) => {

        const errors = {};

        if (!values.pickup) {
            if (!values.buyerAddress) {
                errors.buyerAddress = { header: 'Delivery address is required', message: 'Please enter your delivery address' };
            }
        }

        if (values.payOption === PayOptions.split) {
            for (const key in values.payGuests) {
                const payGuest = values.payGuests[key];
                if (!payGuest.email) {
                    errors[`payGuests.${key}.email`] = { type: 'empty', message: 'Please enter an email' };
                }
                else if (!Util.validateEmail(payGuest.email)) {
                    errors[`payGuests.${key}.email`] = { type: 'invalid', message: 'Please enter a valid email' };
                }
            }
        }

        const billingErrors = [];

        if (values.billing.cardNumber.error) {
            billingErrors.push({ header: 'Card number is invalid', message: values.cardNumber.error.message });
        }
        else if (!values.billing.cardNumber.complete) {
            billingErrors.push({ header: 'Card number is required', message: 'Please enter your card number' });
        }

        if (values.billing.cardExpiry.error) {
            billingErrors.push({ header: 'Card expiry is invalid', message: values.cardExpiry.error.message });
        }
        else if (!values.billing.cardExpiry.complete) {
            billingErrors.push({ header: 'Card expiry is required', message: 'Please enter your card expiry date' });
        }

        if (values.billing.cardCvc.error) {
            billingErrors.push({ header: 'Card security code is invalid', message: values.cardCvc.error.message });
        }
        else if (!values.billing.cardCvc.complete) {
            billingErrors.push({ header: 'Card security code is required', message: 'Please enter your card security code' });
        }

        if (!values.billing.cardName.complete) {
            billingErrors.push({ header: 'Card name is required', message: 'Please enter the name as it appears on your card' });
        }

        if (values.billing.postalCode.error) {
            billingErrors.push({ header: 'Card postal code is invalid', message: values.postalCode.error.message });
        }
        else if (!values.billing.postalCode.complete) {
            billingErrors.push({ header: 'Card postal code is required', message: 'Please enter your card postal code' });
        }

        if (billingErrors.length > 0) {
            errors.billing = billingErrors;
        }

        return errors;
    }
}

class OrderForm extends React.Component {

    handleBillingInfoChange = (values) => {
        const { setFieldValue } = this.props;
        setFieldValue('billing', values);
    }

    handleAcceptTermsClick = () => {
        const { values, setFieldValue } = this.props;
        setFieldValue('acceptedTerms', !values.acceptedTerms);
    }

    updatePayGuestAmounts = (values) => {
        const { food, pickup, quantity, setFieldValue } = this.props;
        const { currentUserPayGuest, payGuests } = values;

        const totalAmount = PriceCalc.getTotalPrice(food, quantity, pickup);
        const totalPortions = currentUserPayGuest.portion + payGuests.reduce((total, payGuest) => total + payGuest.portion, 0);
        const amount = totalAmount / totalPortions;
        currentUserPayGuest.amount = amount * currentUserPayGuest.portion;
        payGuests.forEach(payGuest => {
            payGuest.amount = payGuest.portion * amount;
        });
        setFieldValue('payGuests', payGuests);
        setFieldValue('currentUserPayGuest', currentUserPayGuest);
    }

    hasMissingEmails(errors) {
        for (const key in errors) {
            if (key.startsWith('payGuests'))
                return true;
        }

        return false;
    }

    render() {
        const { food, pickup, quantity, onCheckoutRef, ...form } = this.props;
        const { values, errors, handleSubmit, isSubmitting, submitCount } = form;

        let currentUserAmount;
        let hasMissingEmails = false;
        if (values.payOption === PayOptions.full) {
            currentUserAmount = PriceCalc.getTotalPrice(food, quantity, pickup);
        }
        else {
            currentUserAmount = values.currentUserPayGuest.amount.toFixed(2);
            hasMissingEmails = submitCount > 0 && this.hasMissingEmails(errors);
        }

        return (
            <div className='order-container-width'>

                <FormikEffects onChange={this.updatePayGuestAmounts} />

                {!pickup &&
                    <DeliveryInfo />
                }
                {/* <ContactInfo pickup={pickup} contactMethod={contactMethod} buyerPhone={buyerPhone} /> */}
                <PaymentInfo food={food} pickup={pickup} quantity={quantity} form={form} />

                <BillingInfo onCheckoutRef={onCheckoutRef} onBillingInfoChange={this.handleBillingInfoChange} />

                {submitCount > 0 && errors && errors.buyerAddress &&
                    <Message error>
                        <Message.Header>Delivery Information Missing</Message.Header>
                        <Message.List>
                            <Message.Item>{errors.buyerAddress.message}</Message.Item>
                        </Message.List>
                    </Message>
                }

                {submitCount > 0 && hasMissingEmails &&
                    <Message error>
                        <Message.Header>Payment Information Missing</Message.Header>
                        <Message.List>
                            <Message.Item>Missing or invalid payment guest emails</Message.Item>
                        </Message.List>
                    </Message>
                }

                {submitCount > 0 && errors && errors.billing && errors.billing.length > 0 &&
                    <Message error>
                        <Message.Header>Billing Information Missing</Message.Header>
                        <Message.List>
                            {errors.billing.map((err, index) => {
                                return (<Message.Item key={index}>{err.message}</Message.Item>);
                            })}
                        </Message.List>
                    </Message>
                }

                <Segment>
                    <Checkbox className='order-segment-user-agree-text'
                        data-qa={Dom.Order.userAgreeCheckbox}
                        label="I am over the age of 18 and I agree to this site's user and customer refund policies."
                        onChange={this.handleAcceptTermsClick}
                        checked={values.acceptedTerms} />
                </Segment>

                <Button className='order-confirm-continue-button'
                    data-qa={Dom.Order.confirmButton}
                    fluid
                    animated='fade'
                    disabled={!values.acceptedTerms}
                    loading={isSubmitting}
                    onClick={handleSubmit}>
                    <Button.Content visible>
                        <Icon name='lock' />Confirm and Pay
                    </Button.Content>
                    <Button.Content hidden>
                        <Icon name='lock' />${currentUserAmount} {Constants.Currency}
                    </Button.Content>
                </Button>

            </div>
        );
    }
}

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
        isOrderProcessing: Selectors.isOrderProcessing(state),
        order_id: Selectors.order_id(state),
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
    isOrderProcessing: PropTypes.bool,
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
