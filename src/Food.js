import React, { Component } from 'react'
import Carousel from 'nuka-carousel'
import { Grid, Item, Image, Rating, Icon } from 'semantic-ui-react'
import './Food.css'
// import FoodItems from './data/FoodItems'
import Util from './Util'
import CarouselDecorators from './components/ImageDecorator'
import PriceCalc from './PriceCalc'
import ApiClient from './Api/ApiClient'

class Food extends Component {

    state = {
        quantity: 1,
        foods: []
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

    getFoodImageComponent(food) {
        let imageElement;
        if (food.imageUrls && food.imageUrls.length > 1) {
            const imageUrls = food.imageUrls.map((current, index) =>
                <Image
                    key={index} className='FoodImage' src={current} onLoad={() => Util.triggerEvent(window, 'resize')} />
            );
            imageElement =
                <Carousel dragging={true} cellSpacing={15} edgeEasing="linear" wrapAround={true}
                    decorators={CarouselDecorators}>
                    {imageUrls}
                </Carousel>
        }
        else {
            imageElement = <Image
                className='FoodImage' src={food.imageUrls[0]} />
        }
        return imageElement;
    }

    getFoodPrepLabelComponent(food) {
        let foodPrepClassName = 'LabelPrep-' + food.states[0];
        let foodPrepIcon = Util.getFoodPrepTypeIcon(food);

        let labelElement =
            // <Label content={food.prep} icon={foodPrepIcon} className={foodPrepClassName} size='small' />
            <Icon circular name={foodPrepIcon} className={foodPrepClassName} size='small' />
        return labelElement;
    }

    componentWillMount() {
        let apiClient = new ApiClient();
        apiClient.getFoods()
            .then(response => {
                // todo: rating and ratingCount
                var foodsDTO = [];
                response.data.forEach(foodDAO => {
                    let food = foodDAO;
                    
                    food.rating = 5;
                    food.ratingCount = 3;
                    food.instruction = "Some instruction" //todo: dont know what this is for
                    food.position = { lat: 49.284982, lng: -123.130252 };

                    foodsDTO.push(food);
                });

                this.setState({foods: foodsDTO});
            })
            .catch(err => {
                console.error(err);
            });
    }

    render() {
        const cards = this.state.foods.map((food) => {
            let foodImageComponent = this.getFoodImageComponent(food);
            let foodPrepLabelComponent = this.getFoodPrepLabelComponent(food);

            return (
                <Grid.Column style={{ padding: '0px' }} mobile={16} tablet={16} computer={8} key={food.food_id}>
                    <div className='FoodCard'>
                        <a
                            target='_blank'
                            href={'/foods/' + food.food_id}
                            onMouseEnter={(a, b) => this.handleMouseEnter(a, b, food.food_id)}
                            onMouseLeave={(a, b) => this.handleMouseLeave(a, b, food.food_id)}>
                            <Item style={{ marginBottom: '1px' }}>
                                <Item.Content>
                                    <div className='FoodImageBox'>
                                        {foodImageComponent}
                                    </div>

                                    <Item.Header>
                                        <div className='FoodCardHeader'>
                                        ${PriceCalc.getPrice(food.price)} · {food.title}</div>
                                        <div style={{ clear: 'both' }}></div>
                                    </Item.Header>

                                    <Item.Meta>
                                        <div style={{ display: 'flex' }}>
                                        {foodPrepLabelComponent} 
                                        <span className='food-label'> {food.states} <span style={{ fontWeight: '900'}}>·</span> 
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
            <Grid stackable className='FoodCardGroup'>
                {cards}
            </Grid>
        );

    }
}

export default Food;


