import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Button, Rating } from 'semantic-ui-react'
import { Divider } from 'semantic-ui-react'
import Scroll from 'react-scroll'
import './index.css'
import { Constants } from '../../Constants'
import AppHeader from '../../components/AppHeader'
import AppFooter from '../../components/AppFooter'
import FoodLightbox from '../../components/FoodLightbox'
// import FlagListingMobile from '../../components/FlagListingMobile'
import Drawer from '../../components/Drawer'
import PriceCalc from '../../services/PriceCalc'
import Url from '../../services/Url'
import { Actions, Selectors } from '../../store/order'
import OverviewSection from './OverviewSection'
import ReviewsSection from './ReviewsSection'
import CookSection from './CookSection'
import OrderSection from './OrderSection'
import MobileOrderRequest from './MobileOrderRequest'
import Dom from '../../Dom'

const ScrollLink = Scroll.Link;
const ScrollElement = Scroll.Element;

class FoodDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showOrderDrawer: false
        };
    }

    componentWillMount() {
        const { actions } = this.props;

        // If there already is a submitted order in the current session
        // and the user is on the food detail page then let's clear the
        // previous order before we start.
        if (this.props.order_id) {
            actions.clearOrder();
        }

        const food_id = this.props.match.params.id;
        actions.loadFood(food_id)
            .then(() => {
                document.title = this.props.food.title;
                return actions.loadCook(this.props.food.user_id);
            })
            .then(() => {
                return actions.loadReviews(this.props.food.food_id);
            });
    }

    handleDateChange = (date) => {
        this.props.actions.dateChanged(date);
    }

    handleTimeChange = (time) => {
        this.props.actions.timeChanged(time);
    }

    handleDeliveryOptionChange = (pickup) => {
        if (pickup) {
            this.props.actions.selectPickup();
        }
        else {
            this.props.actions.selectDelivery();
        }
    }

    handleQuantityChange = (delta) => {
        const newValue = this.props.quantity + delta;
        const min = 1;
        const max = Constants.MaxFoodQuantity;

        let newQuantity = parseInt(newValue, 10);
        if (!newQuantity || isNaN(newQuantity) || newQuantity < min || newQuantity > max)
            return;

        this.props.actions.quantityChanged(newQuantity);
    };

    handleOrderButtonClick = () => {
        this.props.history.push(Url.foodOrder(this.props.food.food_id));
    }

    render() {
        const { food, cook, reviews, pickup, quantity, date, time } = this.props;
        if (!food || !cook) {
            return (
                <div>
                    <AppHeader />
                </div>);
        }

        const canRequestOrder = (quantity > 0 && date && time);

        return (
            <div>
                <AppHeader />
                <FoodLightbox food={food} />
                <div>
                    <div className='detail-head-main'>
                        <div className='detail-container'>
                            <div className='detail-item-main'>
                                <ScrollLink activeClass='detail-content-link-active' className='detail-content-link' to='overview'
                                    spy={true} smooth={true} container={document}
                                    offset={-65} duration={500}>
                                    Overview
                                </ScrollLink>

                                <ScrollLink activeClass='detail-content-link-active' className='detail-content-link' to='reviews'
                                    spy={true} smooth={true} container={document}
                                    offset={-70} duration={500}>
                                    Reviews
                                </ScrollLink>

                                <ScrollLink activeClass='detail-content-link-active' className='detail-content-link' to='cook'
                                    spy={true} smooth={true} container={document}
                                    offset={-65} duration={500}>
                                    The Cook
                                </ScrollLink>
                            </div>
                        </div>
                    </div>
                    <div className='detail-container'>
                        <div className='detail-item-main'>
                            <div className='detail-content'>
                                <ScrollElement name='overview'>
                                    <OverviewSection food={food} cook={cook} />
                                </ScrollElement>
                                {/* <FlagListingMobile /> */}
                                <Divider section hidden />
                                <ScrollElement name='reviews'>
                                    <ReviewsSection food={food} reviews={reviews} />
                                </ScrollElement>
                                <ScrollElement name='cook'>
                                    <CookSection cook={cook} />
                                </ScrollElement>
                            </div>
                        </div>
                        <div className='detail-item-right'>
                            <div className='detail-head-right'>
                                <OrderSection food={food} cook={cook} quantity={quantity} date={date} time={time} pickup={pickup} canRequestOrder={canRequestOrder}
                                    onQuantityChange={this.handleQuantityChange}
                                    onOrderButtonClick={this.handleOrderButtonClick}
                                    onDateChange={this.handleDateChange}
                                    onTimeChange={this.handleTimeChange}
                                    onDeliveryOptionChange={this.handleDeliveryOptionChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='detail-footer'>
                        <div className='detail-footer-header'>
                            ${PriceCalc.getTotal(food.price, quantity)} {Constants.Currency}
                            <div>
                                <Rating disabled={true} maxRating={5} rating={food.rating} size='mini' />
                                <div className='detail-footer-rating-count'>{food.ratingCount}</div>
                            </div>
                        </div>
                        <div>
                            <Button data-qa={Dom.FoodDetail.mobileRequestOrder} className='detail-footer-button' onClick={() => this.setState({ showOrderDrawer: true })}>Request an Order</Button>
                            <div className='detail-footer-text'>You won't be charged yet</div>
                        </div>
                    </div>
                </div>

                <Drawer visible={this.state.showOrderDrawer}>
                    <MobileOrderRequest
                        food={food}
                        cook={cook}
                        quantity={quantity}
                        date={date}
                        time={time}
                        pickup={pickup}
                        canRequestOrder={canRequestOrder}
                        onDateChange={this.handleDateChange}
                        onTimeChange={this.handleTimeChange}
                        onDeliveryOptionChange={this.handleDeliveryOptionChange}
                        onQuantityChange={this.handleQuantityChange}
                        onOrderButtonClick={this.handleOrderButtonClick}
                        onHide={() => this.setState({ showOrderDrawer: false })}
                    />
                </Drawer>

                <div className='detail-appfooter'>
                    <AppFooter />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        food: Selectors.food(state),
        cook: Selectors.cook(state),
        reviews: Selectors.reviews(state),
        isFoodLoading: Selectors.isFoodLoading(state),
        isCookLoading: Selectors.isCookLoading(state),
        isReviewsLoading: Selectors.isReviewsLoading(state),
        pickup: Selectors.pickup(state),
        date: Selectors.date(state),
        time: Selectors.time(state),
        quantity: Selectors.quantity(state),
        order_id: Selectors.order_id(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};

FoodDetail.propTypes = {
    food: PropTypes.shape({
        food_id: PropTypes.string.isRequired,
    }),
    cook: PropTypes.shape({
        user_id: PropTypes.string.isRequired,
    }),
    reviews: PropTypes.arrayOf(PropTypes.shape({
        review_id: PropTypes.string.isRequired,
    })),
    isFoodLoading: PropTypes.bool,
    isCookLoading: PropTypes.bool,
    isReviewsLoading: PropTypes.bool,
    pickup: PropTypes.bool.isRequired,
    date: PropTypes.object,
    time: PropTypes.shape({
        handoff_start_date: PropTypes.object,
        handoff_end_date: PropTypes.object
    }),
    quantity: PropTypes.number.isRequired,
    buyerPhone: PropTypes.string,
    order_id: PropTypes.string,

    actions: PropTypes.shape({
        selectPickup: PropTypes.func.isRequired,
        selectDelivery: PropTypes.func.isRequired,
        dateChanged: PropTypes.func.isRequired,
        timeChanged: PropTypes.func.isRequired,
        quantityChanged: PropTypes.func.isRequired,
        loadFood: PropTypes.func.isRequired,
        loadCook: PropTypes.func.isRequired,
        loadReviews: PropTypes.func.isRequired,
        clearOrder: PropTypes.func.isRequired,
    }).isRequired
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FoodDetail));
