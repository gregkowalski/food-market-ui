import React, { Component } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import './FoodDetail.css'
import { Button, Card, Image, Rating } from 'semantic-ui-react'
import { Grid, Header, Divider, Feed } from 'semantic-ui-react'
import FoodItems from './data/FoodItems'
import Suppliers from './data/Suppliers'
import Reviews from './data/Reviews'
import Scroll from 'react-scroll'; // Imports all Mixins
import { Constants } from './Constants'
import AppHeader from './components/AppHeader'

var ScrollLink = Scroll.Link;
var ScrollElement = Scroll.Element;

export default class FoodDetail extends Component {

    state = {};

    getFoodItemId() {
        return this.props.match.params.id;
    }

    componentDidMount() {
        let id = this.getFoodItemId();
        // eslint-disable-next-line 
        let item = FoodItems.find(x => x.id == id);
        document.title = item.header;

        Scroll.scrollSpy.update();
    }

    getFoodPrepSafetyMessage(food) {
        let prep = 'None';
        if (food.prep === 'frozen') {
            prep = 'Frozen products must be fully cooked for food safety and quality.';
        }
        else if (food.prep === 'blank') {
            prep = 'blank';
        }
        return prep;
    }

    render() {
        let id = this.getFoodItemId();
        // eslint-disable-next-line 
        let food = FoodItems.find(x => x.id == id);
        // eslint-disable-next-line 
        let supplier = Suppliers.find(x => x.id == food.supplierId);

        let reviews = Reviews
            .filter(x => x.foodItemId == id);

        reviews = reviews
            .map(x => (
                <div key={x.id}>
                    <Feed>
                        <Feed.Event>
                            <Feed.Content>
                                <Image src={x.image} size='mini' floated='left' shape='circular' />
                                <Feed.Summary content={x.summary} />
                                <Feed.Date content={x.date} style={{ marginTop: '-1px' }} />
                                <Feed.Extra content={x.extraText} style={{ marginTop: '0.8em', maxWidth: '100%' }} />
                            </Feed.Content>
                        </Feed.Event>
                    </Feed>
                    <Divider section />
                </div>
            ));

        let prep = this.getFoodPrepSafetyMessage(food);

        const content = (
            <div className='detail-content'>

                <ScrollElement name="overview">

                    <Header as='h2'>
                        <div style={{ fontSize: '1.1em' }}> {food.header}</div></Header>
                    <div style={{ display: 'inline-block', verticalAlign: 'middle', color: '#4e4e4e', marginTop: '10px', fontSize: '1.1em' }}>
                        {food.availability} available · by
                        <ScrollLink className="author-link" to="cook"
                            spy={true} smooth={true} container={document}
                            offset={-85} duration={500}>
                            {supplier.name}

                        </ScrollLink>
                    </div>
                    <div style={{ clear: 'both' }}></div>

                    <Header as='h3' className='food-detail-header'>Ingredients</Header>
                    <div>{food.meta}</div>

                    <Divider section />

                    <Header as='h3' className='food-detail-header'>The Food</Header>
                    <div>{food.description}</div>

                    <Divider section />

                    <Header as='h3' className='food-detail-header'>Cooking Instructions</Header>
                    <div className='user-text'>{food.instruction}</div>
                    <br />
                    <div>{prep}</div>

                    <Divider section />

                    <Header as='h3' className='food-detail-header'>Special Features</Header>

                    <div>{food.feat}</div>

                    <Divider section />

                    <Header as='h3' className='food-detail-header'>Bite Sizes</Header>
                    <div><strong>{food.unit} </strong> per order.  Feeds approximately {food.feed} people. </div>

                    <Divider section />

                </ScrollElement>

                <ScrollElement name="reviews">

                    <Header as='h2'>
                        <div style={{ display: 'flex', marginTop: '2px', marginBottom: '10px' }}>
                            {food.ratingCount} Reviews
                                    <Rating disabled={true} maxRating={5} rating={food.rating} size='huge'
                                style={{ marginTop: '4px', marginLeft: '14px' }} />
                            <div style={{ fontSize: 'small', color: 'black' }}>{food.ratingCount}</div>
                        </div>
                    </Header>

                    <Divider section />

                    <Grid columns={2} className='rating-grid' stackable>
                        <Grid.Row>
                            <Grid.Column className='detail-rating'>
                                <span className='detail-rating-label'>Accuracy</span>
                                <Rating className='detail-rating-stars' disabled={true} maxRating={5} rating={food.rating} />
                            </Grid.Column>
                            <Grid.Column className='detail-rating'>
                                <span className='detail-rating-label'>Quality</span>
                                <Rating className='detail-rating-stars' disabled={true} maxRating={5} rating={food.rating} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column className='detail-rating'>
                                <span className='detail-rating-label'>Communication</span>
                                <Rating className='detail-rating-stars' disabled={true} maxRating={5} rating={food.rating} />
                            </Grid.Column>
                            <Grid.Column className='detail-rating'>
                                <span className='detail-rating-label'>Taste</span>
                                <Rating className='detail-rating-stars' disabled={true} maxRating={5} rating={food.rating} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column className='detail-rating'>
                                <span className='detail-rating-label'>Freshness</span>
                                <Rating className='detail-rating-stars' disabled={true} maxRating={5} rating={food.rating} />
                            </Grid.Column>
                            <Grid.Column className='detail-rating'>
                                <span className='detail-rating-label'>Value</span>
                                <Rating className='detail-rating-stars' disabled={true} maxRating={5} rating={food.rating} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    <Divider hidden />

                    {reviews}

                </ScrollElement>

                <ScrollElement name="cook">
                    <Header as='h2'>Meet {supplier.name}</Header>
                    <div style={{ float: 'left', color: '#60b0f4', fontWeight: 'bold', fontSize: '1em'}}>
                        {supplier.city}  ·<span style={{ color: '#0fb5c3' }}> Joined in {supplier.join}</span>
                    </div>
                    <div style={{ clear: 'both'}}></div>
                    <div style={{marginTop: '15px'}}>{supplier.info}</div>
                    <br></br>
                    <div> Languages: <strong> {supplier.lang}</strong></div>
                    <br></br>
                    <Image size='small' shape='circular' src={supplier.image} />



                    <Divider section />

                </ScrollElement>

            </div>
        );

        return (
            <div>
                <AppHeader />
                <div>
                    <Image className='food-image' src={food.image} />
                    <div className='detail-head-main'>
                        <div className="flex-container">
                            <div className="flex-item-main">
                                <ScrollLink activeClass="content-link-active" className='content-link' to="overview"
                                    spy={true} smooth={true} container={document}
                                    offset={-85} duration={500}>
                                    Overview
                            </ScrollLink>

                                <ScrollLink activeClass="content-link-active" className='content-link' to="reviews"
                                    spy={true} smooth={true} container={document}
                                    offset={-85} duration={500}>
                                    Reviews
                            </ScrollLink>

                                <ScrollLink activeClass="content-link-active" className='content-link' to="cook"
                                    spy={true} smooth={true} container={document}
                                    offset={-85} duration={500}>
                                    The Cook
                            </ScrollLink>


                            </div>
                            <div className="flex-item-right">
                            </div>
                            <div className='detail-head-right'>
                            </div>
                        </div>
                    </div>
                    <div className="flex-container">
                        <div className="flex-item-main">
                            {content}
                        </div>
                        <div className="flex-item-right">
                            <div className='detail-head-right'>
                                <Card>
                                    <Card.Content>
                                        <Card.Header className='OrderHeader'>
                                            <div style={{ float: 'left' }}>${food.price} CAD</div>
                                            <div style={{ clear: 'left' }}></div>
                                            <div style={{ display: 'flex', marginTop: '2px', marginBottom: '10px' }}>
                                                <Rating disabled={true} maxRating={5} rating={food.rating} size='small'
                                                    style={{ marginTop: '4px', marginLeft: '-2px' }} />
                                                <div style={{ fontSize: 'small', color: 'black' }}>{food.ratingCount}</div>
                                            </div>
                                        </Card.Header>
                                        <Divider section />

                                        <RouterLink to={'/foods/' + this.getFoodItemId() + '/order'}>
                                            <Button fluid color='teal'>Order</Button>
                                        </RouterLink>

                                        <div style={{ textAlign: 'center', marginTop: '10px', color: 'gray' }}>You won't be charged yet</div>
                                    </Card.Content>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='detail-footer'>
                    <RouterLink to={'/foods/' + this.getFoodItemId() + '/order'}>
                        <Button fluid color='teal' className='detail-footer-button'>Order</Button>
                    </RouterLink>
                    <div className='detail-footer-text'>You won't be charged yet</div>
                </div>
            </div>
        )
    }
}