import React, { Component } from 'react'
import './FoodDetail.css'
import { Button, Card, Image, Rating } from 'semantic-ui-react'
import { Grid, Header, Rail, Sticky, Divider, Feed } from 'semantic-ui-react'
import FoodItems from './data/FoodItems'
import Suppliers from './data/Suppliers'
import Reviews from './data/Reviews'
import _ from 'lodash'

export default class FoodDetail extends Component {

    state = {};

    handleContextRef = contextRef => this.setState({ contextRef });

    componentDidMount() {
        let id = this.props.match.params.id;
        // eslint-disable-next-line 
        let item = FoodItems.find(x => x.id == id);
        document.title = item.header;
    }

    render() {
        let id = this.props.match.params.id;
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

        const { contextRef } = this.state;
        return (

            <div className='wrap'>

                <div className='head'>
                    <Image width='85%' style={{ maxHeight: '400px' }} shape='rounded' src={food.image} centered />
                </div>

                <div className='bodywrap'>
                    <div className='center'>

                        <Grid stackable>
                            <Grid.Row columns={1}>
                                <Grid.Column>
                                    <Image width='85%' style={{ maxHeight: '400px' }} shape='rounded' src={food.image} centered />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={2}>

                                <Grid.Column style={{ marginLeft: '10%' }}>
                                    <div ref={this.handleContextRef}>

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

                                        <Header as='h2'>
                                            <div style={{ display: 'flex', marginTop: '2px', marginBottom: '10px' }}>
                                                {food.ratingCount} Reviews
                                    <Rating disabled={true} maxRating={5} rating={food.rating} size='huge'
                                                    style={{ marginTop: '4px', marginLeft: '14px' }} />
                                                <div style={{ fontSize: 'small', color: 'gray' }}>{food.ratingCount}</div>
                                            </div>
                                        </Header>

                                        <Divider section />

                                        <Grid columns={4} className='rating-grid'>
                                            <Grid.Row className='rating-row'>
                                                <Grid.Column><div style={{ fontSize: 'large' }}>Accuracy</div></Grid.Column>
                                                <Grid.Column><Rating disabled={true} maxRating={5} rating={food.rating} /></Grid.Column>
                                                <Grid.Column><div style={{ fontSize: 'large' }}>Location</div></Grid.Column>
                                                <Grid.Column><Rating disabled={true} maxRating={5} rating={food.rating} /></Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row className='rating-row'>
                                                <Grid.Column><div style={{ fontSize: 'large' }}>Quality</div></Grid.Column>
                                                <Grid.Column><Rating disabled={true} maxRating={5} rating={food.rating} /></Grid.Column>
                                                <Grid.Column><div style={{ fontSize: 'large' }}>Healthiness</div></Grid.Column>
                                                <Grid.Column><Rating disabled={true} maxRating={5} rating={food.rating} /></Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row className='rating-row'>
                                                <Grid.Column><div style={{ fontSize: 'large' }}>Accuracy</div></Grid.Column>
                                                <Grid.Column><Rating disabled={true} maxRating={5} rating={food.rating} /></Grid.Column>
                                                <Grid.Column><div style={{ fontSize: 'large' }}>Location</div></Grid.Column>
                                                <Grid.Column><Rating disabled={true} maxRating={5} rating={food.rating} /></Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row>
                                                <Grid.Column><div style={{ fontSize: 'large' }}>Freshness</div></Grid.Column>
                                                <Grid.Column><Rating disabled={true} maxRating={5} rating={food.rating} /></Grid.Column>
                                                <Grid.Column><div style={{ fontSize: 'large' }}>Taste</div></Grid.Column>
                                                <Grid.Column><Rating disabled={true} maxRating={5} rating={food.rating} /></Grid.Column>
                                            </Grid.Row>
                                        </Grid>

                                        <Divider hidden />

                                        {reviews}

                                        <Header as='h2'>Meet the chef</Header>
                                        <Image width='100%' size='medium' shape='rounded' src={supplier.image} />
                                        <div style={{ fontSize: '1.6em', fontWeight: '800', marginTop: '0.5em', marginBottom: '0.4em' }}>{supplier.name}</div>
                                        <div><strong>City:</strong> {supplier.city}</div>
                                        {supplier.info}

                                        <Divider section />

                                        <Rail position='right'>
                                            <Sticky context={contextRef}>
                                                <Card>
                                                    <Card.Content>
                                                        <Card.Header className='FoodCardHeader'>
                                                            <div style={{ float: 'left' }}>${food.price} CAD</div>
                                                            <div style={{ clear: 'left' }}></div>
                                                            <div style={{ display: 'flex', marginTop: '2px', marginBottom: '10px' }}>
                                                                <Rating disabled={true} maxRating={5} rating={food.rating} size='small'
                                                                    style={{ marginTop: '4px', marginLeft: '-2px' }} />
                                                                <div style={{ fontSize: 'small', color: 'gray' }}>{food.ratingCount}</div>
                                                            </div>
                                                        </Card.Header>
                                                        <Divider section />
                                                        <Button fluid color='black' onClick={() => { console.log('button clicked item=' + food.id) }}>Order</Button>
                                                        <div style={{ textAlign: 'center', marginTop: '10px', color: 'gray', fontSize: 'small' }}>You won't be charged yet</div>
                                                    </Card.Content>
                                                </Card>
                                            </Sticky>
                                        </Rail>
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>

                    </div>
                    <div className='right'>
                        <Card>
                            <Card.Content>
                                <Card.Header className='FoodCardHeader'>
                                    <div style={{ float: 'left' }}>${food.price} CAD</div>
                                    <div style={{ clear: 'left' }}></div>
                                    <div style={{ display: 'flex', marginTop: '2px', marginBottom: '10px' }}>
                                        <Rating disabled={true} maxRating={5} rating={food.rating} size='small'
                                            style={{ marginTop: '4px', marginLeft: '-2px' }} />
                                        <div style={{ fontSize: 'small', color: 'gray' }}>{food.ratingCount}</div>
                                    </div>
                                </Card.Header>
                                <Divider section />
                                <Button fluid color='black' onClick={() => { console.log('button clicked item=' + food.id) }}>Order</Button>
                                <div style={{ textAlign: 'center', marginTop: '10px', color: 'gray', fontSize: 'small' }}>You won't be charged yet</div>
                            </Card.Content>
                        </Card>
                    </div>
                </div>


            </div>
        )
    }
}
