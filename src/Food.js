import React, { Component } from 'react'
import './Food.css'
import { Grid, Item, Image, Rating, Label } from 'semantic-ui-react'
import FoodItems from './data/FoodItems'
import Util from './Util'
import Carousel from 'nuka-carousel'
import CarouselDecorators from './components/ImageDecorator'

class Food extends Component {

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
        // let foodPrepClassName = 'LabelPrep-' + food.prep;
        // let foodPrepIcon = Util.getFoodPrepTypeIcon(food);

        let imageElement;
        if (food.images && food.images.length > 1) {
            const images = food.images.map((current, index) =>
                <Image
                    // fluid label={{ className: foodPrepClassName, content: food.prep, icon: foodPrepIcon, ribbon: true }}
                    key={index} className='FoodImage' src={current} />
            );
            imageElement =
                <Carousel dragging={true} cellSpacing={15} edgeEasing="linear" wrapAround={true}
                    decorators={CarouselDecorators}>
                    {images}
                </Carousel>
        }
        else {
            imageElement = <Image
                // fluid label={{ className: foodPrepClassName, content: food.prep, icon: foodPrepIcon, ribbon: true }}
                className='FoodImage' src={food.image} />
        }
        return imageElement;
    }

    getFoodPrepLabelComponent(food) {
        let foodPrepClassName = 'LabelPrep-' + food.prep;
        let foodPrepIcon = Util.getFoodPrepTypeIcon(food);

        let labelElement =
            <Label content={food.prep} icon={foodPrepIcon} className={foodPrepClassName} size='small' />

        return labelElement;
    }

    render() {
        const cards = FoodItems.map((food) => {
            let foodImageComponent = this.getFoodImageComponent(food);
            let foodPrepLabelComponent = this.getFoodPrepLabelComponent(food);

            return (
                <Grid.Column style={{ padding: '0px' }} mobile={16} tablet={16} computer={8} key={food.id}>
                    <div className='FoodCard'>
                        <a
                            target='_blank'
                            href={'/foods/' + food.id}
                            onMouseEnter={(a, b) => this.handleMouseEnter(a, b, food.id)}
                            onMouseLeave={(a, b) => this.handleMouseLeave(a, b, food.id)}>
                            <Item style={{ marginBottom: '1px' }}>
                                <Item.Content>
                                    <div className='FoodImageBox'>
                                        {foodImageComponent}
                                        {/* <Image className='FoodImage' src={food.image} /> */}
                                    </div>

                                    <Item.Header>
                                        <div className='FoodCardHeader'>
                                            ${food.price} · {food.header}</div>
                                        <div style={{ clear: 'both' }}></div>
                                    </Item.Header>

                                    {/* <Item.Meta>
                    <div style={{ float: 'left', fontSize: '1.36em', marginTop: '8px', fontWeight: 'bold' }}>
                      {foodPrepLabelComponent}
                    </div>
                    <div style={{ display: 'flex', marginTop: '0px', marginBottom: '1px' }}>
                      <Rating disabled={true} maxRating={5} rating={food.rating} size='mini'
                        style={{ marginTop: '15px', marginLeft: '5px' }} />
                      <div> <span style={{fontFamily: 'Athiti', fontWeight: '500' }}>{food.ratingCount} reviews</span></div>
                    </div>
                    <div style={{ clear: 'both' }}></div>
                  </Item.Meta> */}

                                    <Item.Meta>
                                        <div style={{ display: 'flex', marginTop: '0px', marginBottom: '1px' }}>
                                            <Rating disabled={true} maxRating={5} rating={food.rating} size='mini'
                                                style={{ marginTop: '5px', marginLeft: '-2px' }} />
                                            <div> <span style={{ fontFamily: 'Athiti', fontWeight: '500', fontSize: '1.1em' }}>{food.ratingCount} reviews</span></div>

                                            <div style={{ marginLeft: '5px', fontWeight: 'bold' }}>
                                                {foodPrepLabelComponent}
                                            </div>
                                        </div>
                                    </Item.Meta>

                                </Item.Content>
                            </Item>
                        </a>
                        {/* <Link to={'/foods/' + food.id + '/order'}>
              <Button as='div' fluid color='teal' className='OrderButton'>Order</Button>
            </Link> */}
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
