import React, { Component } from 'react'
import Carousel from 'nuka-carousel'
import { Grid, Item, Image, Rating, Icon, Divider } from 'semantic-ui-react'
import './FoodGrid.css'
import PriceCalc from '../../services/PriceCalc'
import Util from '../../services/Util'
import Url from '../../services/Url'

export default class FoodGrid extends Component {

    handleMouseLeave = (a, b, id) => {
        if (this.props.onFoodItemLeave) {
            this.props.onFoodItemLeave(id);
        }
    }

    handleMouseEnter = (a, b, id) => {
        if (this.props.onFoodItemEnter) {
            this.props.onFoodItemEnter(id);
        }
    }

    render() {
        const { foods } = this.props;

        if (!foods) {
            return null;
        }

        if (foods.length <= 0) {
            return (
                <div>
                    <div className='foodgrid-no-results'>
                        <div className='foodgrid-no-results-header'><Icon color='purple' name='map signs' />Try adjusting your search. Here's what you can do:</div>
                        <ul>
                            <li>Change your filters or dates</li>
                            <li>Zoom out on the map</li>
                            <li>Search a specific neighbourhood or address</li>
                        </ul>
                    </div>
                    <Divider />
                </div>
            );
        }

        const cards = foods.map((food) => {
            return (
                <Grid.Column style={{ padding: '0px' }} mobile={16} tablet={16} computer={8} key={food.food_id}>
                    <div className='foodgrid-card'>
                        <a
                            target='_blank'
                            rel='noopener noreferrer'
                            href={Url.foodDetail(food.food_id)}
                            onMouseEnter={(a, b) => this.handleMouseEnter(a, b, food.food_id)}
                            onMouseLeave={(a, b) => this.handleMouseLeave(a, b, food.food_id)}>
                            <Item style={{ marginBottom: '1px' }}>
                                <Item.Content>
                                    <div className='foodgrid-imagebox'>
                                        <FoodImage food={food} />
                                    </div>

                                    <Item.Header>
                                        <div className='foodgrid-card-header'>
                                            ${PriceCalc.getPrice(food.price)} · {food.title}</div>
                                        <div style={{ clear: 'both' }}></div>
                                    </Item.Header>

                                    <Item.Meta>
                                        <div style={{ display: 'flex' }}>
                                            <FoodPrepLabel food={food} />
                                            <span className='foodgrid-label'> {food.states} <span style={{ fontWeight: '900' }}>·</span>
                                                <Rating disabled={true} maxRating={5} rating={food.rating} size='mini'
                                                    style={{ marginTop: '5px', marginLeft: '2px' }} />
                                                {food.ratingCount}
                                            </span>
                                        </div>
                                    </Item.Meta>

                                </Item.Content>
                            </Item>
                        </a>
                    </div>
                </Grid.Column>
            )
        });
        return (
            <Grid stackable className='foodgrid' width={16}>
                {cards}
            </Grid>
        );

    }
}

const FoodImage = ({ food }) => {

    // goToSlide, nextSlide and previousSlide functions in addition to slideCount and currentSlide
    const carouselLeftButton = ({ previousSlide }) => {

        const getButtonStyles = (disabled) => {
            return {
                border: 0,
                background: 'linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,0.05), rgba(0,0,0,0.1), rgba(0,0,0,0.15), rgba(0,0,0,0.2))',
                color: 'white',
                paddingRight: 10,
                outline: 0,
                opacity: disabled ? 0.3 : 1,
                cursor: 'pointer',
                height: '100%',
                zIndex: 5
            }
        }

        const handleClick = (e) => {
            e.preventDefault();
            previousSlide();
        }

        return (
            <button className='foodgrid-image-hidedecorator'
                style={getButtonStyles()}
                onClick={handleClick}>
                <Icon size='huge' name='angle left' />
            </button>
        );
    }

    const carouselRightButton = ({ nextSlide }) => {
        const getButtonStyles = (disabled) => {
            return {
                border: 0,
                background: 'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.05), rgba(0,0,0,0.1), rgba(0,0,0,0.15), rgba(0,0,0,0.2))',
                color: 'white',
                paddingLeft: 10,
                outline: 0,
                opacity: disabled ? 0.3 : 1,
                cursor: 'pointer',
                height: '100%',
                zIndex: 5
            }
        }
        const handleClick = (e) => {
            e.preventDefault();
            nextSlide();
        }
        return (
            <button className='foodgrid-image-hidedecorator'
                style={getButtonStyles()}
                onClick={handleClick}>
                <Icon size='huge' name='angle right' />
            </button>
        );
    }

    const none = () => { };

    let imageElement;
    if (food.imageUrls && food.imageUrls.length > 1) {
        const images = food.imageUrls.map((current, index) => (
            <Image key={index} className='foodgrid-image' src={current} onLoad={() => Util.triggerEvent(window, 'resize')} />
            // <div key={index} className='foodgrid-image-bg' onLoad={() => Util.triggerEvent(window, 'resize')} style={{backgroundImage: 'url("' + current + '")'}}></div>
        ));
        imageElement = (
            <Carousel dragging={true} cellSpacing={15} edgeEasing="linear" wrapAround={true}
                renderBottomCenterControls={none}
                renderCenterLeftControls={carouselLeftButton}
                renderCenterRightControls={carouselRightButton}
            >
                {images}
            </Carousel>
        );
    }
    else {
        imageElement = (<Image className='foodgrid-image' src={food.imageUrls[0]} />);
        // imageElement = <div className='foodgrid-image-bg' style={{backgroundImage: 'url("' + food.imageUrls[0] + '")'}}></div>
    }
    return imageElement;
}

const FoodPrepLabel = ({ food }) => {
    let foodPrepClassName = 'foodgrid-prep-' + food.states[0];
    let foodPrepIcon = Util.getFoodPrepTypeIcon(food);

    let labelElement = (
        <Icon circular name={foodPrepIcon} className={foodPrepClassName} size='small' />
    );
    return labelElement;
}
