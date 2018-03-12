import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Button, Image, Icon, Rating, Segment } from 'semantic-ui-react'
import { Grid, Header, Divider, Feed } from 'semantic-ui-react'
import Scroll from 'react-scroll' // Imports all Mixins
import ShowMore from 'react-show-more'
import './FoodDetail.css'
import Constants from '../Constants'
import AppHeader from '../components/AppHeader'
import FoodLightbox from '../components/FoodLightbox'
import FlagListing from '../components/FlagListing'
import FlagListingMobile from '../components/FlagListingMobile'
import Drawer from '../components/Drawer'
import OrderRequest from '../components/OrderRequest'
import CognitoUtil from '../services/Cognito/CognitoUtil'
import PriceCalc from '../services/PriceCalc'
import Util from '../services/Util'
import { Actions, Selectors } from '../store/order'
import DeliverySelector from '../components/DeliverySelector'
import DateTimeSelector from '../components/DateTimeSelector'
import QuantitySelector from '../components/QuantitySelector'
import OrderPriceSummary from '../components/OrderPriceSummary'
import OrderRequestHeader from '../components/OrderRequestHeader'

var ScrollLink = Scroll.Link;
var ScrollElement = Scroll.Element;

class FoodDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hasErrors: {},
            showOrderDrawer: false
        };
    }

    componentWillMount() {
        if (!CognitoUtil.isLoggedIn()) {
            CognitoUtil.setLastPath(window.location.pathname);
            CognitoUtil.redirectToLoginIfNoSession();
            return;
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
        const url = `/foods/${this.props.food.food_id}/order`;
        this.props.history.push(url);
    }

    render() {
        const { food, cook, reviews, pickup, quantity, date, time, buyerEmail, buyerPhone } = this.props;
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
                                    offset={-85} duration={500}>
                                    Overview
                                </ScrollLink>

                                <ScrollLink activeClass='content-link-active' className='content-link' to='reviews'
                                    spy={true} smooth={true} container={document}
                                    offset={-85} duration={500}>
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
                                <OverviewSection food={food} cook={cook} scrollElement='overview' />
                                <FlagListingMobile />
                                <Divider section hidden />
                                <ReviewsSection food={food} reviews={reviews} scrollElement='reviews' />
                                <CookSection cook={cook} scrollElement='cook' />
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
                        <div className='detail-footer-header' style={{ float: 'left' }}>
                            ${PriceCalc.getTotal(food.price, quantity)} CAD
                        <div style={{ display: 'flex' }}>
                            <Rating disabled={true} maxRating={5} rating={food.rating} size='mini' style={{ marginTop: '10px' }} />
                                <div style={{ marginTop: '6px', fontSize: 'small', color: '#494949' }}>{food.ratingCount}</div>
                            </div>
                        </div>
                        <div style={{ float: 'right', marginRight: '12px' }}>
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
        buyerEmail: Selectors.buyerEmail(state),
        buyerPhone: Selectors.buyerPhone(state),
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
    buyerEmail: PropTypes.string,
    buyerPhone: PropTypes.string,

    actions: PropTypes.shape({
        selectPickup: PropTypes.func.isRequired,
        selectDelivery: PropTypes.func.isRequired,
        addressChanged: PropTypes.func.isRequired,
        dateChanged: PropTypes.func.isRequired,
        timeChanged: PropTypes.func.isRequired,
        quantityChanged: PropTypes.func.isRequired,
        buyerEmailChanged: PropTypes.func.isRequired,
        buyerPhoneChanged: PropTypes.func.isRequired,
        loadFood: PropTypes.func.isRequired,
        loadCook: PropTypes.func.isRequired,
        loadReviews: PropTypes.func.isRequired,
    }).isRequired

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FoodDetail));

const OverviewSection = ({ food, cook, scrollElement }) => {
    return (
        <ScrollElement name={scrollElement}>

            <Header className='detail-main-header' as='h2'>
                ${food.price} · {food.title}
            </Header>
            <div style={{ display: 'inline-block', verticalAlign: 'middle', color: '#4e4e4e', margin: '5px 0px 3px 2px', fontSize: '1.2em', fontFamily: 'Athiti' }}>
                locally handcrafted by
                <ScrollLink className='author-link' to='cook'
                    spy={true} smooth={true} container={document}
                    offset={-85} duration={500}>
                    {cook ? cook.name : '...'}
                </ScrollLink>
            </div>
            <div style={{ clear: 'both' }}></div>
            <div style={{ color: '#5e5d5d', marginTop: '20px' }}>
                <FoodOptions food={food} />
            </div>

            <Header as='h3' className='food-detail-header'>The Food</Header>
            <div className='detail-body-text'>
                <ShowMore
                    lines={3}
                    more={<div style={{ color: '#189da7' }}>Read more about this food <Icon name='angle down' /></div>}
                    less={<div style={{ color: '#189da7' }}>Hide <Icon name='angle up' /></div>}
                    anchorClass='showmore-text'>

                    <div className='user-text'>{food.short_description} </div>
                    <div>{food.long_desciption}</div>
                </ShowMore>  </div>
            <Divider section />

            <Header as='h3' className='food-detail-header'>Ingredients</Header>
            <div className='detail-body-text'>{food.title}.</div>

            <Divider section />

            <Header as='h3' className='food-detail-header'>Allergy Information</Header>
            <div className='detail-body-text'>
                <div className='user-text'>
                    <div style={{ fontWeight: '600' }} >
                        May contain one or more of the following allergens:
                    </div>
                </div>
                <div style={{ marginLeft: '15px', marginTop: '15px' }}>{food.allergies.join(',')}.</div>
                <div style={{ marginTop: '15px' }}>
                    <Icon color='teal' name='angle double right' />
                    For any questions regarding allergens or other specific contents, please contact your neighbourhood cook directly.
                </div>
            </div>

            <Divider section />

            <Header as='h3' className='food-detail-header'>Prep + Storage</Header>
            <div className='detail-body-text'>
                <ShowMore
                    more={<div style={{ color: '#189da7' }}>Get more details <Icon name='angle down' /></div>}
                    less={<div style={{ color: '#189da7' }}>Hide <Icon name='angle up' /></div>}
                    anchorClass='showmore-text'>
                    <div className='user-text'>
                        {food.instruction}
                    </div>
                </ShowMore>
                <div style={{ marginTop: '15px' }}>
                    <FoodPrepSafetyMessage food={food} />
                </div>
            </div>
            <Divider section />

            <Header as='h3' className='food-detail-header'>Bite Sizes</Header>
            <div className='detail-body-text'><span style={{ fontWeight: '600' }}>{food.unit} </span> per order.  Feeds approximately {food.feed} people. </div>
            <Divider section />

            <Header as='h3' className='food-detail-header'>Special Features</Header>
            <div className='detail-body-text'>{food.features.join(', ')}</div>

            <Divider section hidden />

        </ScrollElement>
    );
}

const ReviewsSection = ({ food, reviews, scrollElement }) => {
    return (
        <ScrollElement name={scrollElement}>
            <Header className='detail-sub-header' as='h2'>
                <div style={{ display: 'flex', marginTop: '2px', marginBottom: '10px' }}>
                    {food.ratingCount} Reviews
                    <Rating disabled={true} maxRating={5} rating={food.rating} size='huge' style={{ marginTop: '10px', marginLeft: '14px' }} />
                </div>
            </Header>
            <Divider section />
            <FoodRatingSection food={food} />
            <Divider section />
            <ReviewList reviews={reviews} />
        </ScrollElement>
    );
}

const CookSection = ({ cook, scrollElement }) => {
    if (!cook)
        return null;

    return (
        <ScrollElement name={scrollElement}>
            <Header className='detail-sub-header' as='h2'>Meet {cook.name}</Header>
            <div className='detail-cook-sub-header'>
                {cook.city} · <span style={{ color: '#0fb5c3' }}> Joined in {cook.join_date}</span>
            </div>
            <div style={{ clear: 'both' }}></div>
            <div className='detail-cook-text'>{cook.info}
                <div style={{ marginTop: '15px' }}>
                    Languages:
                <span style={{ fontWeight: '600' }}>{cook.lang}</span>
                </div>
            </div>
            <div style={{ marginTop: '25px' }}>
                <Image size='small' circular src={cook.image} />
            </div>
        </ScrollElement>
    );
}

const OrderSection = ({ food, pickup, date, time, quantity,
    onOrderButtonClick, onQuantityChange, onDateChange, onTimeChange, onDeliveryOptionChange }) => {

    return (
        <Segment>
            <OrderRequestHeader food={food} />
            <DeliverySelector pickup={pickup} onChange={onDeliveryOptionChange} />
            <DateTimeSelector date={date} time={time}
                onDateChange={onDateChange}
                onTimeChange={onTimeChange} />
            <QuantitySelector food={food} quantity={quantity} onChange={onQuantityChange} />

            {/* <div className='mobileorder-input-descriptions'>
                    We take your privacy seriously. Your address is never shown publicly. We use this data to improve our geosearch and matching.
                </div> */}

            <OrderPriceSummary food={food} quantity={quantity} pickup={pickup} />

            <RequestOrderButton food={food} quantity={quantity} onClick={onOrderButtonClick} />
            <div className='detail-card-charged-footnote'>You won't be charged yet</div>

            <FlagListing />
        </Segment>
    )
}

const RequestOrderButton = ({ food, quantity, onClick }) => {
    return (
        <Button animated='fade' fluid className='detail-desktop-button' onClick={onClick}>
            <Button.Content visible>
                Request an Order
            </Button.Content>
            <Button.Content hidden>
                ${PriceCalc.getTotal(food.price, quantity)} CAD
            </Button.Content>
        </Button>
    );
}

const FoodPrepSafetyMessage = ({ food }) => {
    if (food.states[0] === 'frozen') {
        return (<span><Icon color='teal' name='angle double right' />
            Frozen products must be fully cooked for food safety and quality.</span>)
    }
    else if (food.states[0] === 'cooked') {
        return (<span><Icon color='teal' name='angle double right' />
            Store your food properly: keep cold food cold and hot food hot!</span>)
    }
    return null;
}

const FoodOptions = ({ food }) => {

    let foodPrepIcon = Util.getFoodPrepTypeIcon(food);
    return (
        <Grid doubling columns={5}>
            <Grid.Row>
                <Grid.Column>
                    <span className='food-detail-icon-tags'><Icon name={foodPrepIcon} /> {food.states[0]}</span>
                </Grid.Column>
                <Grid.Column>
                    {food.delivery && <span className='food-detail-icon-tags'><Icon name='shipping' /> delivery</span>}
                </Grid.Column>
                <Grid.Column>
                    {food.pickup && <span className='food-detail-icon-tags'><Icon name='hand rock' />pick-up</span>}
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

const ReviewList = ({ reviews }) => {

    if (!reviews || reviews.length === 0)
        return null;

    const reviewComponentList = reviews.map(review => (
        <div key={review.review_id}>
            <Feed>
                <Feed.Event>
                    <Feed.Content>
                        <Image src={review.imageUrl} size='mini' floated='left' circular />
                        <div style={{ float: 'right', color: '#5e5d5d' }}>
                            <a href='url' style={{ color: '#5e5d5d' }}> <Icon name='flag outline' /></a></div>
                        <Feed.Summary className='detail-body-text'>{review.summary} </Feed.Summary>
                        <Feed.Date content={review.date} style={{ fontFamily: 'Athiti', fontSize: '1.1em', fontWeight: '600', marginTop: '-1px' }} />
                        <Feed.Extra style={{ marginTop: '0.8em', maxWidth: '100%' }} >
                            <div className='detail-body-text'>
                                <ShowMore
                                    lines={4}
                                    more={<div style={{ color: '#189da7' }}>Read more</div>}
                                    less=''>
                                    {review.comment}
                                </ShowMore>
                            </div>
                        </Feed.Extra>
                    </Feed.Content>
                </Feed.Event>
            </Feed>
            <Divider section />
        </div>
    ));

    return (
        <div>
            {reviewComponentList}
        </div>
    );
}

const FoodRatingSection = ({ food }) => {
    return (
        <Grid stackable columns={2}>
            <Grid.Row>
                <Grid.Column className='detail-rating'>
                    <span className='detail-rating-label'>Accuracy</span>
                    <Rating className='detail-rating-stars' disabled={true} maxRating={5} rating={food.rating} />
                </Grid.Column>
                <Grid.Column className='detail-rating'>
                    <span className='detail-rating-label'>Quality</span>
                    <Rating className='detail-rating-stars' disabled={true} maxRating={5} rating={food.rating} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column className='detail-rating'>
                    <span className='detail-rating-label'>Communication</span>
                    <Rating className='detail-rating-stars' disabled={true} maxRating={5} rating={food.rating} />
                </Grid.Column>
                <Grid.Column className='detail-rating'>
                    <span className='detail-rating-label'>Taste</span>
                    <Rating className='detail-rating-stars' disabled={true} maxRating={5} rating={food.rating} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column className='detail-rating'>
                    <span className='detail-rating-label'>Freshness</span>
                    <Rating className='detail-rating-stars' disabled={true} maxRating={5} rating={food.rating} />
                </Grid.Column>
                <Grid.Column className='detail-rating'>
                    <span className='detail-rating-label'>Value</span>
                    <Rating className='detail-rating-stars' disabled={true} maxRating={5} rating={food.rating} />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}