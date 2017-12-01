import React, { Component } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import './FoodDetail.css'
import { Button, Card, Image, Rating } from 'semantic-ui-react'
import { Grid, Header, Divider, Feed } from 'semantic-ui-react'
import FoodItems from './data/FoodItems'
import Suppliers from './data/Suppliers'
import Reviews from './data/Reviews'
import Scroll from 'react-scroll'; // Imports all Mixins

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

    render() {
        let id = this.getFoodItemId();
        // eslint-disable-next-line 
        let food = FoodItems.find(x => x.id == id);
        // eslint-disable-next-line 
        let supplier = Suppliers.find(x => x.id == food.supplierId);

        const reviews = Reviews.map(x => (
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

        const content = (
            <div className='detail-content'>

                <ScrollElement name="overview">

                    <Header as='h2'>{food.header}</Header>
                    {food.description}

                    <Divider section />

                    <Header as='h2'>Availability</Header>
                    <div>There are {food.availability} units available</div>

                    <Divider section />

                    <Header as='h2'>Ingredients</Header>
                    <div>{food.meta}</div>

                    <Divider section />

                    <Header as='h2'>Cooking Process</Header>
                    <div>Prepared in the most healthy way you can imagine</div>

                    <Divider section />

                </ScrollElement>

                <ScrollElement name="cook">
                    <Header as='h2'>Meet the chef</Header>
                    <Image width='100%' size='medium' src={supplier.image} />
                    <div style={{ fontSize: '1.6em', fontWeight: '800', marginTop: '0.5em', marginBottom: '0.4em' }}>{supplier.name}</div>
                    <div><strong>City:</strong> {supplier.city}</div>
                    {supplier.info}

                    <Divider section />

                </ScrollElement>

                <ScrollElement name="reviews">

                    <Header as='h2'>
                        <div style={{ display: 'flex', marginTop: '2px', marginBottom: '10px' }}>
                            {food.ratingCount} Reviews
                                            <Rating disabled={true} maxRating={5} rating={food.rating} size='huge'
                                style={{ marginTop: '4px', marginLeft: '14px' }} />
                            <div style={{ fontSize: 'small', color: 'gray' }}>{food.ratingCount}</div>
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
                                <span className='detail-rating-label'>Location</span>
                                <Rating className='detail-rating-stars' disabled={true} maxRating={5} rating={food.rating} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column className='detail-rating'>
                                <span className='detail-rating-label'>Quality</span>
                                <Rating className='detail-rating-stars' disabled={true} maxRating={5} rating={food.rating} />
                            </Grid.Column>
                            <Grid.Column className='detail-rating'>
                                <span className='detail-rating-label'>Healthy</span>
                                <Rating className='detail-rating-stars' disabled={true} maxRating={5} rating={food.rating} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column className='detail-rating'>
                                <span className='detail-rating-label'>Fresh</span>
                                <Rating className='detail-rating-stars' disabled={true} maxRating={5} rating={food.rating} />
                            </Grid.Column>
                            <Grid.Column className='detail-rating'>
                                <span className='detail-rating-label'>Taste</span>
                                <Rating className='detail-rating-stars' disabled={true} maxRating={5} rating={food.rating} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    <Divider hidden />

                    {reviews}

                </ScrollElement>
            </div>
        );

        return (
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

                            <ScrollLink activeClass="content-link-active" className='content-link' to="cook"
                                spy={true} smooth={true} container={document}
                                offset={-85} duration={500}>
                                The Chef
                            </ScrollLink>

                            <ScrollLink activeClass="content-link-active" className='content-link' to="reviews"
                                spy={true} smooth={true} container={document}
                                offset={-85} duration={500}>
                                Reviews
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
                                            <div style={{ fontSize: 'small', color: 'gray' }}>{food.ratingCount}</div>
                                        </div>
                                    </Card.Header>
                                    <Divider section />

                                    <RouterLink to={'/foods/' + this.getFoodItemId() + '/order'}>
                                        <Button fluid color='black'>Order</Button>
                                    </RouterLink>

                                    <div style={{ textAlign: 'center', marginTop: '10px', color: 'gray', fontSize: 'small' }}>You won't be charged yet</div>
                                </Card.Content>
                            </Card>
                        </div>
                    </div>
                </div>

                <div className='detail-footer'>
                    <RouterLink to={'/foods/' + this.getFoodItemId() + '/order'}>
                        <Button fluid color='black' className='detail-footer-button'>Order</Button>
                    </RouterLink>
                    <div className='detail-footer-text'>You won't be charged yet</div>
                </div>
            </div>
        )
    }
}