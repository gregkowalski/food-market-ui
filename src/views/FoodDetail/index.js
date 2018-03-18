import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Button, Rating } from 'semantic-ui-react'
import { Divider } from 'semantic-ui-react'
import Scroll from 'react-scroll'
import './index.css'
import Constants from '../../Constants'
import AppHeader from '../../components/AppHeader'
import FoodLightbox from '../../components/FoodLightbox'
import FlagListingMobile from '../../components/FlagListingMobile'
import Drawer from '../../components/Drawer'
import PriceCalc from '../../services/PriceCalc'
import Url from '../../services/Url'
import { Actions, Selectors } from '../../store/order'

import OverviewSection from './OverviewSection'
import ReviewsSection from './ReviewsSection'
import CookSection from './CookSection'
import OrderSection from './OrderSection'
import OrderRequest from './OrderRequest'

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
        // If there already is a submitted order in the current session
        // and the user is on the food detail page then let's clear the
        // previous order before we start.
        if (this.props.order_id) {
            this.props.actions.clearOrder();
        }

        let food_id = this.props.match.params.id;
        this.props.actions.loadFood(food_id)
            .then(() => {
                document.title = this.props.food.title;
                return this.props.actions.loadCook(this.props.food.user_id);
            })
            .then(() => {
                return this.props.actions.loadReviews(this.props.food.food_id);
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
        if (!food) {
            return null;
        }

        return (
            <div>
                <AppHeader />
                <FoodLightbox food={food} />
                <div>
                    <div className='detail-head-main'>
                        <div className='flex-container'>
                            <div className='flex-item-main'>
                                <ScrollLink activeClass='content-link-active' className='content-link' to='overview'
                                    spy={true} smooth={true} container={document}
                                    offset={-65} duration={500}>
                                    Overview
                                </ScrollLink>

                                <ScrollLink activeClass='content-link-active' className='content-link' to='reviews'
                                    spy={true} smooth={true} container={document}
                                    offset={-70} duration={500}>
                                    Reviews
                                </ScrollLink>

                                <ScrollLink activeClass='content-link-active' className='content-link' to='cook'
                                    spy={true} smooth={true} container={document}
                                    offset={-85} duration={500}>
                                    The Cook
                                </ScrollLink>
                            </div>
                        </div>
                    </div>
                    <div className='flex-container'>
                        <div className='flex-item-main'>
                            <div className='detail-content'>
                                <ScrollElement name='overview'>
                                    <OverviewSection food={food} cook={cook} />
                                </ScrollElement>
                                <FlagListingMobile />
                                <Divider section hidden />
                                <ScrollElement name='reviews'>
                                    <ReviewsSection food={food} reviews={reviews} />
                                </ScrollElement>
                                <ScrollElement name='cook'>
                                    <CookSection cook={cook} />
                                </ScrollElement>
                                <Divider section />
                            </div>
                        </div>
                        <div className='flex-item-right'>
                            <div className='detail-head-right'>
                                <OrderSection food={food} quantity={quantity} date={date} time={time} pickup={pickup}
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
                            ${PriceCalc.getTotal(food.price, quantity)} CAD
                            <div>
                                <Rating disabled={true} maxRating={5} rating={food.rating} size='mini' />
                                <div className='detail-footer-rating-count'>{food.ratingCount}</div>
                            </div>
                        </div>
                        <div>
                            <Button className='detail-footer-button' onClick={() => this.setState({ showOrderDrawer: true })}>Request an Order</Button>
                            <div className='detail-footer-text'>You won't be charged yet</div>
                        </div>
                    </div>
                </div>

                <Drawer visible={this.state.showOrderDrawer}>
                    <OrderRequest food={food} quantity={quantity} date={date} time={time} pickup={pickup}
                        onDateChange={this.handleDateChange}
                        onTimeChange={this.handleTimeChange}
                        onDeliveryOptionChange={this.handleDeliveryOptionChange}
                        onQuantityChange={this.handleQuantityChange}
                        onOrderButtonClick={this.handleOrderButtonClick}
                        onHide={() => this.setState({ showOrderDrawer: false })}
                    />
                </Drawer>

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
    isFoodLoading: PropTypes.bool.isRequired,
    isCookLoading: PropTypes.bool.isRequired,
    isReviewsLoading: PropTypes.bool.isRequired,
    pickup: PropTypes.bool.isRequired,
    date: PropTypes.object,
    time: PropTypes.number,
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