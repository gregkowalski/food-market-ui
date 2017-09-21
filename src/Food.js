import React, { Component } from 'react'
import './Food.css'
import { Grid, Button, Card, Image, Rating } from 'semantic-ui-react'
import { FoodItems } from './FoodItems'

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
        <a target='_blank'
          href={'https://mojokitchn.wixsite.com/dumplings?src=' + item.header}
          onMouseEnter={(a, b) => this.handleMouseEnter(a, b, item.id)}
          onMouseLeave={(a, b) => this.handleMouseLeave(a, b, item.id)}>
          <Card fluid className='FoodCard'>
            <Card.Content>
              <Image width='100%' shape='rounded' src={item.image} />
              <Card.Header className='FoodCardHeader'>
                <div style={{ float: 'left' }}>{item.header}</div>
                <div style={{ float: 'right' }}>${item.price}</div>
                <div style={{ clear: 'both' }}></div>
              </Card.Header>
              <Card.Meta>
                <div style={{display: 'flex', marginTop: '2px', marginBottom: '10px'}}>
                  <Rating disabled={true} maxRating={5} rating={item.rating} size='large'
                    style={{ marginTop: '2px', marginLeft: '-2px' }} />
                  <div>{item.ratingCount}</div>
                </div>
                <div><strong>Availability:</strong> {item.availability}</div>
                <div><strong>Ingredients:</strong> {item.meta}</div>
              </Card.Meta>
              <Card.Description>
                {item.description}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Button basic fluid color='black' onClick={() => { console.log('button clicked item=' + item.id) }}>Order</Button>
            </Card.Content>
          </Card>
        </a>
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
