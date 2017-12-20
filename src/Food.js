import React, { Component } from 'react'
import './Food.css'
import { Grid, Item, Image, Rating } from 'semantic-ui-react'
import FoodItems, { FoodPrepType } from './data/FoodItems'

import Carousel from 'nuka-carousel'

class Food extends Component {

  handleMouseLeave(a, b, id) {
    console.log(`Mouse left item id=${id}`);
    if (this.props.onFoodItemLeave) {
      this.props.onFoodItemLeave(id);
    }
  }

  handleMouseEnter(a, b, id) {
    console.log(`Mouse entered item id=${id}`);
    if (this.props.onFoodItemEnter) {
      this.props.onFoodItemEnter(id);
    }
  }

  handleClick(a, b, id) {
    console.log(`Clicked item id=${id}`);
  }

  getFoodPrepTypeColor(food) {
    let foodPrepColor = 'pink';
    if (food.prep === FoodPrepType.frozen) {
      foodPrepColor = 'blue';
    }
    else if (food.prep === FoodPrepType.ready) {
      foodPrepColor = 'olive';
    }
    return foodPrepColor;
  }

  getFoodPrepTypeIcon(food) {
    let foodPrepIcon = 'shopping basket';
    if (food.prep === FoodPrepType.frozen) {
      foodPrepIcon = 'snowflake outline';
    }
    else if (food.prep === FoodPrepType.ready) {
      foodPrepIcon = 'checkmark box';
    }
    return foodPrepIcon;
  }

  getFoodImageComponent(food) {
    let foodPrepColor = this.getFoodPrepTypeColor(food);
    let foodPrepIcon = this.getFoodPrepTypeIcon(food);

    let imageElement;
    if (food.images && food.images.length > 1) {
      const images = food.images.map((current, index) =>
        <Image
          fluid label={{ as: 'a', color: foodPrepColor, content: food.prep, icon: foodPrepIcon, ribbon: true }}
          key={index} className='FoodImage' src={current} />
      );
      imageElement =
        <Carousel dragging={true} cellSpacing={15} edgeEasing="linear" decorators={[]}>
          {images}
        </Carousel>
    }
    else {
      imageElement = <Image fluid label={{ as: 'a', color: foodPrepColor, content: food.prep, icon: foodPrepIcon, ribbon: true }}
        className='FoodImage' src={food.image} />
    }
    return imageElement;
  }

  render() {
    const cards = FoodItems.map((food) => {

      let foodImageComponent = this.getFoodImageComponent(food);

      return (
        <Grid.Column mobile={16} tablet={8} computer={5} key={food.id}>
          <div className='FoodCard'>
            <a
              target='_blank'
              href={'/#/foods/' + food.id}
              onMouseEnter={(a, b) => this.handleMouseEnter(a, b, food.id)}
              onMouseLeave={(a, b) => this.handleMouseLeave(a, b, food.id)}>
              <Item style={{ marginBottom: '3em' }}>
                <Item.Content>
                  <div className='FoodImageBox'>
                    {foodImageComponent}
                    {/* <Image className='FoodImage' src={food.image} /> */}
                  </div>
                  <Item.Header className='FoodCardHeader'>
                    <div style={{ float: 'left', fontSize: '1.36em', marginTop: '3px', fontWeight: '500', fontFamily: 'Athiti' }}>
                      ${food.price} · {food.header}</div>
                    <div style={{ clear: 'both' }}></div>
                  </Item.Header>

                  <Item.Meta>
                    <div style={{ float: 'left', fontSize: '1.36em', marginTop: '3px', fontWeight: 'bold' }}></div>
                    <div style={{ clear: 'both' }}></div>
                    <div style={{ display: 'flex', marginTop: '3px', marginBottom: '10px' }}>
                      <Rating disabled={true} maxRating={5} rating={food.rating} size='large'
                        style={{ marginTop: '2px', marginLeft: '-2px', fontFamily: 'Athiti', fontWeight: '300' }} />
                      <div>{food.ratingCount} reviews</div>
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
