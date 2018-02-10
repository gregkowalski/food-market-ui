import React, { Component } from 'react'
import Carousel from 'nuka-carousel'
import './components/ImageDecorator.css'
import { Grid, Item, Image, Rating, Icon } from 'semantic-ui-react'
import './Food.css'
import Util from './Util'
import PriceCalc from './PriceCalc'
import createReactClass from 'create-react-class';

import { setTimeout } from 'timers';

class FoodCarousel extends Component {

    state = {
        quantity: 1,
    };

    isDebug = false;

    handleMouseLeave(a, b, id) {
        if (this.isDebug) {
            console.log(`Mouse left item id=${id}`);
        }
        if (this.props.onFoodItemLeave) {
            this.props.onFoodItemLeave(id);
        }
    }

    handleMouseEnter(a, b, id) {
        if (this.isDebug) {
            console.log(`Mouse entered item id=${id}`);
        }
        if (this.props.onFoodItemEnter) {
            this.props.onFoodItemEnter(id);
        }
    }

    handleClick(a, b, id) {
        if (this.isDebug) {
            console.log(`Clicked item id=${id}`);
        }
    }

    getFoodPrepLabelComponent(food) {
        let foodPrepClassName = 'LabelPrep-' + food.states[0];
        let foodPrepIcon = Util.getFoodPrepTypeIcon(food);

        let labelElement =
            // <Label content={food.prep} icon={foodPrepIcon} className={foodPrepClassName} size='small' />
            <Icon circular name={foodPrepIcon} className={foodPrepClassName} size='small' />
        return labelElement;
    }

    componentDidMount() {
        if (this.props.onSelected) {
            let selectedFood = this.props.foods[0];
            this.props.onSelected(selectedFood);
        }
    }

    render() {
        const slides = this.props.foods.map((food, index) => {

            let foodPrepLabelComponent = this.getFoodPrepLabelComponent(food);

            return (
                <div className='FoodCard2' key={food.food_id}>
                    <a style={{color: 'inherit'}}
                        target='_blank'
                        href={'/foods/' + food.food_id}
                        onMouseEnter={(a, b) => this.handleMouseEnter(a, b, food.food_id)}
                        onMouseLeave={(a, b) => this.handleMouseLeave(a, b, food.food_id)}>

                        <Item style={{ marginBottom: '1px' }}>
                            <Item.Content>
                                <div>
                                    <Image src={food.imageUrls[0]} onLoad={() => Util.triggerEvent(window, 'resize')}
                                        onClick={() => console.log('clicked: ' + food.food_id)} />
                                </div>
                                {/* href={'/foods/' + food.food_id} */}

                                <Item.Header>
                                    <div className='FoodCardHeader2' style={
                                        {
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                        }
                                    }>
                                        ${PriceCalc.getPrice(food.price)} · {food.title}</div>
                                    <div style={{ clear: 'both' }}></div>
                                </Item.Header>

                                <Item.Meta>
                                    <div style={{ display: 'flex' }}>
                                        {foodPrepLabelComponent}
                                        <span className='food-label'> {food.states} <span style={{ fontWeight: '900' }}>·</span>
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
            );
        });

        return (
            <Carousel dragging={true} cellSpacing={15} edgeEasing='easeInOutQuint' wrapAround={true} slidesToShow={1.25}
                swiping={true} decorators={null} afterSlide={this.afterFoodSlide}>
                {slides}
            </Carousel>
        )
    }

    afterFoodSlide = (index) => {
        if (this.props.onSelected) {
            setTimeout(() => {
                let selectedFood = this.props.foods[index];
                this.props.onSelected(selectedFood);
            }, 0);
        }
    }
}

export default FoodCarousel;

const FoodCarouselDecorators = [
    {
        component: createReactClass({
            render() {
                return (
                    <button className='FoodImageHideDecorator'
                        style={this.getButtonStyles(this.props.currentSlide === 0 && !this.props.wrapAround)}
                        onClick={this.handleClick}><Icon size='huge' name='angle left' style={{ marginBottom: '50px', width: '20px' }} /></button>
                )
            },
            handleClick(e) {
                e.preventDefault();
                this.props.previousSlide();
            },
            getButtonStyles(disabled) {
                return {
                    border: 0,
                    //background: 'linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,0.05), rgba(0,0,0,0.1), rgba(0,0,0,0.15), rgba(0,0,0,0.2))',
                    background: 'rgba(0,0,0,0)',
                    color: 'grey',
                    paddingRight: 10,
                    outline: 0,
                    opacity: disabled ? 0.3 : 1,
                    cursor: 'pointer',
                    height: '100%'
                }
            }
        }),
        position: 'CenterLeft'
    },
    {
        component: createReactClass({
            render() {
                return (
                    <button className='FoodImageHideDecorator'
                        style={this.getButtonStyles(this.props.currentSlide + this.props.slidesToScroll >= this.props.slideCount && !this.props.wrapAround)}
                        onClick={this.handleClick}><Icon size='huge' name='angle right' style={{ marginBottom: '50px', width: '20px' }} /></button>
                )
            },
            handleClick(e) {
                e.preventDefault();
                this.props.nextSlide();
            },
            getButtonStyles(disabled) {
                return {
                    border: 0,
                    //background: 'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.05), rgba(0,0,0,0.1), rgba(0,0,0,0.15), rgba(0,0,0,0.2))',
                    background: 'rgba(0,0,0,0)',
                    color: 'grey',
                    paddingLeft: 10,
                    outline: 0,
                    opacity: disabled ? 0.3 : 1,
                    cursor: 'pointer',
                    height: '100%'
                }
            }
        }),
        position: 'CenterRight'
    },
];