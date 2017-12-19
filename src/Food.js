import React, { Component } from 'react'
import './Food.css'
import { Grid, Button, Item, Image, Icon, Rating } from 'semantic-ui-react'
import FoodItems from './data/FoodItems'
import { Link } from 'react-router-dom'
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

  render() {
    const cards = FoodItems.map((food) => {

      let imageElement;
      if (food.images && food.images.length > 1) {
        const images = food.images.map((current, index) =>
          <Image 
            fluid label={{ as: 'a', color: 'olive', content: 'ready', icon: 'checkmark box', ribbon: true }} 
            key={index} className='FoodImage' src={current} />
        );
        imageElement =
          <Carousel dragging={true} cellSpacing={15} edgeEasing="linear" decorators={[]}>
            {images}
          </Carousel>
      }
      else {
        imageElement = <Image fluid label={{ as: 'a', color: 'pink', content: 'ingredient', icon: 'shopping basket', ribbon: true }}
          className='FoodImage' src={food.image} />
      }

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
                    {imageElement}
                    {/* <Image className='FoodImage' src={food.image} /> */}
                  </div>
                  <div style={{ float: 'left', color: '#60b0f4', marginTop: '4px', fontSize: '1.2em', fontFamily: 'Athiti', fontWeight: '300' }}><strong>{food.availability} available ·
                  <span style={{ color: '#0fb5c3' }}> {food.prep}
                    </span></strong>
                  </div>

                  <br></br>

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
            <Link to={'/foods/' + food.id + '/order'}>
              <Button as='div' fluid color='teal' className='OrderButton'>Order</Button>
            </Link>
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
