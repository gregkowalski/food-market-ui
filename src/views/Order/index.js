import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Button, Icon, Checkbox, Segment, Message } from 'semantic-ui-react'
import './index.css'
import OrderHeader from '../../components/OrderHeader'
import ApiClient from '../../services/ApiClient'
import CognitoUtil from '../../services/Cognito/CognitoUtil'
import PriceCalc from '../../services/PriceCalc'
import { Actions, Selectors } from '../../store/order'
import OrderSummary from './OrderSummary'
import ContactInfo from './ContactInfo'
import BillingInfo from './BillingInfo'
import ContactMethods from '../../data/ContactMethods';

class Order extends React.Component {

    state = { acceptedTerms: false };

    componentWillMount() {
        if (!CognitoUtil.isLoggedIn()) {
            CognitoUtil.setLastPath(window.location.pathname);
            CognitoUtil.redirectToLoginIfNoSession();
            return;
        }

        let food_id = this.props.match.params.id;

        // Validate the order here.  If no date, time, quantity has been selected then bail.
        const { date, time, quantity } = this.props;
        if (date == null || time == null || quantity == null) {
            const url = `/foods/${food_id}`;
            this.props.history.push(url);
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

    // handleConfirmButtonClick = () => {
    //     if (this.state.orderProcessing) {paymentError
    //         console.log('Confirmation is already processing...');
    //         return;
    //     }

    //     console.log('Confirmation processing');
    //     this.setState({ orderProcessing: true });

    //     ApiClient.confirmFoodOrder(null, this.state.order_id)
    //         .then(response => {
    //             console.log('Confirmation finished');
    //             console.log(response);
    //             this.setState({ orderProcessing: false });
    //         })
    //         .catch(ex => {
    //             this.handleError(ex);
    //         });
    // }

    handleOrderButtonClick = () => {

        this.props.actions.submitOrder(this.checkout);
        return;

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
            })
            .catch(ex => {
                this.handleError(ex);
            });
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

    canSubmitOrder() {
        const { acceptedTerms } = this.state;
        const { isOrderProcessing, buyerAddress, isBuyerAddressValid, isBuyerPhoneValid, pickup, contactMethod } = this.props;

        if (!acceptedTerms || isOrderProcessing)
            return false;

        if (!pickup && (!isBuyerAddressValid || !buyerAddress))
            return false;

        if (contactMethod === ContactMethods.phone && !isBuyerPhoneValid)
            return false;

        return true;
    }

    render() {
        const { food, pickup, quantity, date, time, contactMethod,
            buyerPhone, isBuyerPhoneValid,
            buyerAddress, isBuyerAddressValid,
            isOrderProcessing
        } = this.props;

        if (!food) {
            return null;
        }
        const { acceptedTerms, paymentError } = this.state;

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
                                onCheckoutRef={ref => this.checkout = ref} />

                            <Segment>
                                <Checkbox className='order-segment-user-agree-text'
                                    label="I agree to this site's user and customer refund policy and that I am over the age of 18. I also agree to pay the total amount shown, which includes service fees."
                                    onChange={() => this.setState({ acceptedTerms: !acceptedTerms })}
                                    checked={acceptedTerms} />
                            </Segment>

                            <Message header='Order Processing Error' icon='exclamation circle'
                                content={paymentError}
                                error={paymentError}
                                hidden={!paymentError}
                                visible={paymentError} />

                            <Button fluid className='order-confirm-continue-button'
                                disabled={!this.canSubmitOrder()}
                                loading={isOrderProcessing}
                                onClick={this.handleOrderButtonClick}
                            >
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
    isOrderProcessing: PropTypes.bool,

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
