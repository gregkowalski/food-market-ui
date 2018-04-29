import React, { Component } from 'react'
import Carousel from 'nuka-carousel'
import { Grid, Item, Image, Rating, Icon, Divider } from 'semantic-ui-react'
import './FoodGrid.css'
import CarouselDecorators from './ImageDecorator'
import PriceCalc from '../../services/PriceCalc'
import Util from '../../services/Util'
import Url from '../../services/Url'

export default class FoodGrid extends Component {

    handleMouseLeave(a, b, id) {
        if (this.props.onFoodItemLeave) {
            this.props.onFoodItemLeave(id);
        }
    }

    handleMouseEnter(a, b, id) {
        if (this.props.onFoodItemEnter) {
            this.props.onFoodItemEnter(id);
        }
    }

    getFoodImageComponent(food) {
        let imageElement;
        if (food.imageUrls && food.imageUrls.length > 1) {
            const imageUrls = food.imageUrls.map((current, index) => (
                <Image key={index} className='foodgrid-image' src={current} onLoad={() => Util.triggerEvent(window, 'resize')} />
            ));
            imageElement = (
                <Carousel dragging={true} cellSpacing={15} edgeEasing="linear" wrapAround={true} decorators={CarouselDecorators}>
                    {imageUrls}
                </Carousel>
            );
        }
        else {
            imageElement = <Image className='foodgrid-image' src={food.imageUrls[0]} />
        }
        return imageElement;
    }

    getFoodPrepLabelComponent(food) {
        let foodPrepClassName = 'foodgrid-prep-' + food.states[0];
        let foodPrepIcon = Util.getFoodPrepTypeIcon(food);

        let labelElement = (
            <Icon circular name={foodPrepIcon} className={foodPrepClassName} size='small' />
        );
        return labelElement;
    }

    render() {
        const { foods, date, pickup } = this.props;

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
                            <li> Zoom out on the map </li>
                            <li>Search a specific neighbourhood or address</li>
                        </ul>
                    </div>
                    <Divider />
                </div>
            );
        }

        const cards = foods.map((food) => {
            let foodImageComponent = this.getFoodImageComponent(food);
            let foodPrepLabelComponent = this.getFoodPrepLabelComponent(food);

            return (
                <Grid.Column style={{ padding: '0px' }} mobile={16} tablet={16} computer={8} key={food.food_id}>
                    <div className='foodgrid-card'>
                        <a
                            target='_blank'
                            href={Url.foodDetail(food.food_id, pickup, date)}
                            onMouseEnter={(a, b) => this.handleMouseEnter(a, b, food.food_id)}
                            onMouseLeave={(a, b) => this.handleMouseLeave(a, b, food.food_id)}>
                            <Item style={{ marginBottom: '1px' }}>
                                <Item.Content>
                                    <div className='foodgrid-imagebox'>
                                        {foodImageComponent}
                                    </div>

                                    <Item.Header>
                                        <div className='foodgrid-card-header'>
                                            ${PriceCalc.getPrice(food.price)} · {food.title}</div>
                                        <div style={{ clear: 'both' }}></div>
                                    </Item.Header>

                                    <Item.Meta>
                                        <div style={{ display: 'flex' }}>
                                            {foodPrepLabelComponent}
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
