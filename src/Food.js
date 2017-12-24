import React, { Component } from 'react'
import './Food.css'
import { Grid, Item, Image, Rating, Label } from 'semantic-ui-react'
import FoodItems from './data/FoodItems'
import Util from './Util'
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

  getFoodImageComponent(food) {
    let foodPrepClassName = 'LabelPrep-' + food.prep;
    let foodPrepIcon = Util.getFoodPrepTypeIcon(food);

    let imageElement;
    if (food.images && food.images.length > 1) {
      const images = food.images.map((current, index) =>
        <Image
          fluid label={{ className: foodPrepClassName, content: food.prep, icon: foodPrepIcon, ribbon: true }}
          key={index} className='FoodImage' src={current} />
      );
      imageElement =
        <Carousel dragging={true} cellSpacing={15} edgeEasing="linear" decorators={[]}>
          {images}
        </Carousel>
    }
    else {
      imageElement = <Image fluid label={{ className: foodPrepClassName, content: food.prep, icon: foodPrepIcon, ribbon: true }}
        className='FoodImage' src={food.image} />
    }
    return imageElement;
  }

  getFoodPrepLabelComponent(food) {
    let foodPrepClassName = 'LabelPrep-' + food.prep;
    let foodPrepIcon = Util.getFoodPrepTypeIcon(food);

    let labelElement; {
      labelElement =
        <Label content={food.prep} icon={foodPrepIcon} className={foodPrepClassName} size='small' />
    }
    return labelElement;
  }

  render() {
    const cards = FoodItems.map((food) => {

      let foodImageComponent = this.getFoodImageComponent(food);
      let foodPrepLabelComponent = this.getFoodPrepLabelComponent(food);

      return (
        <Grid.Column mobile={16} tablet={8} computer={5} key={food.id}>
          <div className='FoodCard'>
            <a
              target='_blank'
              href={'/#/foods/' + food.id}
              onMouseEnter={(a, b) => this.handleMouseEnter(a, b, food.id)}
              onMouseLeave={(a, b) => this.handleMouseLeave(a, b, food.id)}>
              <Item style={{ marginBottom: '1px' }}>
                <Item.Content>
                  <div className='FoodImageBox'>
                    {foodImageComponent}
                    {/* <Image className='FoodImage' src={food.image} /> */}
                  </div>


                  <Item.Meta>
                    <div style={{ display: 'flex', marginTop: '3px' }}>
                      <Rating disabled={true} maxRating={5} rating={food.rating} size='mini'
                        style={{ marginTop: '5px', marginLeft: '-2px' }} />
                      <div> <span style={{ fontFamily: 'Athiti', fontWeight: '500'}}>{food.ratingCount} reviews</span></div>
                    </div>
                  </Item.Meta>

                  <Item.Meta>
                    <div style={{ float: 'left', fontSize: '1.36em', marginTop: '1px', fontWeight: 'bold' }}>
                      {foodPrepLabelComponent}
                    </div>
                  </Item.Meta>


                  <Item.Header className='FoodCardHeader'>
                    <div style={{ float: 'left', marginTop: '3px', fontSize: '1.36em', fontWeight: '500', fontFamily: 'Athiti' }}>
                      <span style={{ fontSize: '1.3em' }}> ${food.price} </span>· {food.header}</div>
                    <div style={{ clear: 'both' }}></div>
                  </Item.Header>

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
