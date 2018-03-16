import React, { Component } from 'react'
import Carousel from 'nuka-carousel'
import { setTimeout } from 'timers';
import { Item, Image, Rating, Icon } from 'semantic-ui-react'
import './ImageDecorator.css'
import Util from '../services/Util'
import Url from '../services/Url'
import PriceCalc from '../services/PriceCalc'

export default class FoodCarousel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            quantity: 1,
            selectedSlideIndex: 0
        };
    }

    hasFoods() {
        return this.props.foods && this.props.foods.length > 0;
    }

    handleAfterFoodSlide = (index) => {
        if (this.props.onSelected) {
            setTimeout(() => {
                this.setState({ selectedSlideIndex: index });
                this.props.onSelected(this.props.foods[index]);
            }, 50);
        }
    }

    componentDidMount() {
        if (this.props.onSelected && this.hasFoods()) {
            let selectedFood = this.props.foods[0];
            this.props.onSelected(selectedFood);
        }
    }

    render() {

        if (!this.hasFoods()) {
            return <div></div>;
        }

        const { foods, pickup, date } = this.props;

        // this is for a defect in nuka-carousel where if there's only one item
        // it doesn't generate a list element with a margin-left of 7.5px
        let foodCardStyle = {};
        if (foods.length === 1) {
            foodCardStyle.marginLeft = '7.5px';
        }

        const slides = foods.map((food, index) => {

            let imageStyle = { height: '100px' };
            const isSelected = index === this.state.selectedSlideIndex;
            if (isSelected) {
                imageStyle.border = '2px solid teal';
            }

            return (
                <div className='FoodCard2' key={food.food_id} style={foodCardStyle}>
                    <a style={{ color: 'inherit' }}
                        target='_blank'
                        href={Url.foodDetail(food.food_id, pickup, date)}>

                        <Item style={{ marginBottom: '1px' }}>
                            <Item.Content>
                                <div>
                                    <Image src={food.imageUrls[0]} style={imageStyle}
                                        onLoad={() => Util.triggerEvent(window, 'resize')} />
                                </div>

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
                                        <FoodPrepLabel food={food} />
                                        <span className='food-label'>
                                            {food.states}
                                            <span style={{ fontWeight: '900' }}>·</span>
                                            <Rating style={{ marginTop: '5px', marginLeft: '2px' }}
                                                disabled={true} maxRating={5} rating={food.rating} size='mini' />
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

        let selectedSlideIndex = foods.findIndex(food => food.food_id === this.props.selectedFoodId);
        if (selectedSlideIndex < 0) {
            selectedSlideIndex = 0;
        }

        let slidesToShow = 2.1;
        if (window.innerHeight < window.innerWidth) {
            slidesToShow = 4;
        }

        return (
            <Carousel
                dragging={true}
                cellSpacing={15}
                edgeEasing='easeInOutQuint'
                wrapAround={true}
                slidesToShow={slidesToShow}
                swiping={true}
                decorators={null}
                afterSlide={this.handleAfterFoodSlide}
                slideIndex={selectedSlideIndex}
            >
                {slides}
            </Carousel>
        )
    }
}

const FoodPrepLabel = ({ food }) => {
    let foodPrepClassName = 'LabelPrep-' + food.states[0];
    let foodPrepIcon = Util.getFoodPrepTypeIcon(food);

    return (<Icon circular name={foodPrepIcon} className={foodPrepClassName} size='small' />);
}