import React, { Component } from 'react'
import Carousel from 'nuka-carousel'
import { Item, Image, Rating, Icon } from 'semantic-ui-react'
import './FoodCarousel.css'
import Util from '../services/Util'
import Url from '../services/Url'
import PriceCalc from '../services/PriceCalc'
import Colors from '../data/Colors'

export default class FoodCarousel extends Component {

    state = {};
    
    hasFoods() {
        return this.props.foods && this.props.foods.length > 0;
    }

    handleAfterFoodSlide = (index) => {
        if (this.props.onSelected) {
            this.props.onSelected(this.props.foods[index]);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.foods !== nextProps.foods) {
            const { foods } = nextProps;
            if (foods && foods.length > 0) {
                this.setState({ selectedSlideIndex: 0 });
            }
        }

        if (this.props.mapSelectedFoodId !== nextProps.mapSelectedFoodId) {
            const { foods } = this.props;
            let selectedSlideIndex = foods.findIndex(food => food.food_id === nextProps.mapSelectedFoodId);
            if (selectedSlideIndex < 0) {
                selectedSlideIndex = 0;
            }
            this.setState({ selectedSlideIndex });
        }
    }

    componentDidMount() {
        const { foods } = this.props;
        if (foods && foods.length > 0) {
            this.setState({ selectedSlideIndex: 0 });
        }
    }

    render() {
        const { foods, pickup, date, selectedFoodId } = this.props;
        if (!foods || foods.length <= 0) {
            return null;
        }

        const { selectedSlideIndex } = this.state;

        // this is for a defect in nuka-carousel where if there's only one item
        // it doesn't generate a list element with a margin-left of 7.5px
        let foodCardStyle = {};
        if (foods.length === 1) {
            foodCardStyle.marginLeft = '7.5px';
        }

        const ratio = window.innerWidth / window.innerHeight;
        const slidesToShow = 2.4;

        const slides = foods.map((food, index) => {

            let borderColor = 'transparent';
            if (food.food_id === selectedFoodId) {
                borderColor = Colors.purple;
            }

            const imageStyle = { borderTop: `5px solid ${borderColor}` };

            return (
                <div key={food.food_id} style={foodCardStyle}>
                    <a style={{ color: 'inherit' }}
                        target='_blank'
                        href={Url.foodDetail(food.food_id, pickup, date)}>

                        <Item>
                            <Item.Content>
                                <Image className='foodcarousel-card-image' style={imageStyle} src={food.imageUrls[0]}
                                    onLoad={() => Util.triggerEvent(window, 'resize')} />

                                <Item.Header>
                                    <div className='foodcarousel-card-header'>
                                        ${PriceCalc.getPrice(food.price)} · {food.title}
                                    </div>
                                </Item.Header>

                                <Item.Meta>
                                    <div className='foodcarousel-card-info'>
                                        <FoodPrepLabel food={food} />
                                        <span>{food.states}</span>
                                        <Rating size='mini' disabled={true} maxRating={5} rating={food.rating} />
                                        <span>{food.ratingCount}</span>
                                    </div>
                                </Item.Meta>

                            </Item.Content>
                        </Item>
                    </a>
                </div>
            );
        });

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

    return (<Icon name={foodPrepIcon} className={foodPrepClassName} size='mini' />);
}