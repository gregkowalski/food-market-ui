import React, { Component } from 'react'
import './Food.css'
import { Grid, Button, Item, Image, Rating } from 'semantic-ui-react'
import FoodItems from './data/FoodItems'
import { Link } from 'react-router-dom'


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
    const cards = FoodItems.map((item) =>

      <Grid.Column mobile={16} tablet={8} computer={5} key={item.id}>
        <div className='FoodCard'>
          <a
            target='_blank'
            href={'/#/foods/' + item.id}
            onMouseEnter={(a, b) => this.handleMouseEnter(a, b, item.id)}
            onMouseLeave={(a, b) => this.handleMouseLeave(a, b, item.id)}>
            <Item style={{marginBottom: '3em'}}>
              <Item.Content>
                <div className='FoodImageBox'>
                  <Image className='FoodImage' src={item.image}/>
                </div>
                <div style={{ float: 'left', color: '#da4242', marginTop: '4px', fontSize: '.9em'}}><strong>{item.availability} AVAILABLE · {item.prep}</strong></div>
                <br></br>
                <Item.Header className='FoodCardHeader'>
                  <div style={{ float: 'left', fontSize: '1.36em', marginTop: '3px', fontWeight: 'bold' }}>${item.price} | {item.header}</div>
                  <div style={{ clear: 'both' }}></div>
                </Item.Header>
                <Item.Meta>
                <div style={{ float: 'left', fontSize: '1.36em', marginTop: '3px', fontWeight: 'bold' }}></div>
                  <div style={{ clear: 'both' }}></div>
                  <div style={{ display: 'flex', marginTop: '3px', marginBottom: '10px' }}>
                    <Rating disabled={true} maxRating={5} rating={item.rating} size='large'
                      style={{ marginTop: '2px', marginLeft: '-2px' }} />
                    <div>{item.ratingCount} reviews</div>
                  </div>              
                </Item.Meta>
              </Item.Content>
            </Item>
          </a>
          <Link to={'/foods/' + item.id + '/order'}>
            <Button as='div' fluid color='black' className='OrderButton'>Order</Button>
          </Link>
        </div>
      </Grid.Column>
    );
    return (
      <Grid stackable className='FoodCardGroup'>
        {cards}
      </Grid>
    );
  }
}

export default Food;
