import React, { Component } from 'react'
import './FoodDetail.css'
import { Button, Card, Image, Rating } from 'semantic-ui-react'
import { FoodItems } from './FoodItems'
import Suppliers from './Suppliers'
import { Grid, Header, Rail, Sticky, Divider, Feed, Table } from 'semantic-ui-react'
import _ from 'lodash'

const Placeholder = () => <Image src='/assets/images/paragraph.png' />

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

        const reviewItems = [
            {
                date: '3 days ago',
                image: '/assets/images/suppliers/jenny.jpg',
                summary: 'Jenny',
                extraText: "My husband and I, and another couple, stayed at Luca's. His mother met us and guided us to their trullo which we absolutely adored. His parents were fabulous helping us with the fireplace, delivering fresh vegetables, showing us their garden areas and recanting the history of their family trullo. It was very difficult to leave after only 2 days; it was a peaceful, quiet country sojourn. The kitchen was great for cooking and we enjoyed drinking coffee in the morning sunshine on the patio, a washing machine was very useful as was the ring rack and finally we had great sleeps.",
            },
            {
                date: 'September 2017',
                image: '/assets/images/suppliers/elliot.jpg',
                summary: 'Elliot',
                extraText: "The Trulli itself was a great place to stay. Luca's father met us in Cisternino and led us to the Trulli (thankfully because I don't think we would have found it on our own). The Trulli was very clean and the kitchen was conducive to cooking meals. It was great to have \"family room/kitchen table\" as a sitting area where we all hung out and played cards. His father was also very accessible the next day when we couldn't figure out how to use the washing machine and his wife came over to show us how. The fireplace was a bit difficult to use and did not give us consistent heat so we did find the place a bit cold. Also we did not realize that in the South many places are closed in Ciscternino and the surrounding area therefore 4 days in March was a bit long when we were finding things to do. Lastly, the two rooms were great for sleeping however only one of them was still in true \"Trulli\" fashion. It was a bit disappointing to the two of us who stayed in the plain ikea-like room. All in all a unique place to stay and we enjoyed our stay!",
            },
            {
                date: 'June 2017',
                image: '/assets/images/suppliers/steve.jpg',
                summary: 'Steve',
                extraText: "Beautiful trulli a few kilometers outside of Cisternino. The place is nice and clean, although a bit smaller than we expected. But nevertheless a very nice place to stay.",
            },
            {
                date: 'December 2016',
                image: '/assets/images/suppliers/daniel.jpg',
                summary: 'Daniel',
                extraText: "This is a fabulous place to stay. It was a little out of town so very peaceful, easy to park and very cosy.",
            },
            {
                date: 'February 2016',
                image: '/assets/images/suppliers/molly.png',
                summary: 'Molly',
                extraText: "We enjoyed the warm welcome from Biagio. Beautiful trulli renovated with taste and beautifully decorated. Ideally located few minutes away with a car from Cisternino. Only the cats outside the house can be annoying sometime :)"
            }
        ];

        const reviews = reviewItems.map(x => (
            <div>
                <Divider section />
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
            </div>
        ));

        const { contextRef } = this.state;
        return (

            <Grid stackable>
                <Grid.Row columns={1}>
                    <Grid.Column>
                        <Image width='85%' style={{ maxHeight: '400px' }} shape='rounded' src={food.image} centered />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>

                    <Grid.Column style={{ 'margin-left': '10%' }}>
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
                                    <Rating disabled={true} maxRating={5} rating={food.rating}
                                        style={{ marginTop: '8px', marginLeft: '10px' }} />
                                    <div style={{ fontSize: 'small', color: 'gray' }}>{food.ratingCount}</div>
                                </div>
                            </Header>

                            <Divider section />

                            <Table compact='very' style={{ border: 'none' }} singleLine>

                                <Table.Body>
                                    <Table.Row >
                                        <Table.Cell><div style={{ fontSize: 'large' }}>Accuracy</div></Table.Cell>
                                        <Table.Cell><Rating disabled={true} maxRating={5} rating={food.rating} /></Table.Cell>
                                        <Table.Cell><div style={{ fontSize: 'large' }}>Location</div></Table.Cell>
                                        <Table.Cell><Rating disabled={true} maxRating={5} rating={food.rating} /></Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell><div style={{ fontSize: 'large' }}>Quality</div></Table.Cell>
                                        <Table.Cell><Rating disabled={true} maxRating={5} rating={food.rating} /></Table.Cell>
                                        <Table.Cell><div style={{ fontSize: 'large' }}>Healthiness</div></Table.Cell>
                                        <Table.Cell><Rating disabled={true} maxRating={5} rating={food.rating} /></Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell><div style={{ fontSize: 'large' }}>Accuracy</div></Table.Cell>
                                        <Table.Cell><Rating disabled={true} maxRating={5} rating={food.rating} /></Table.Cell>
                                        <Table.Cell><div style={{ fontSize: 'large' }}>Location</div></Table.Cell>
                                        <Table.Cell><Rating disabled={true} maxRating={5} rating={food.rating} /></Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell><div style={{ fontSize: 'large' }}>Freshness</div></Table.Cell>
                                        <Table.Cell><Rating disabled={true} maxRating={5} rating={food.rating} /></Table.Cell>
                                        <Table.Cell><div style={{ fontSize: 'large' }}>Taste</div></Table.Cell>
                                        <Table.Cell><Rating disabled={true} maxRating={5} rating={food.rating} /></Table.Cell>
                                    </Table.Row>

                                </Table.Body>

                            </Table>

                            {reviews}

                            <Divider section />

                            <Header as='h2'>Meet the chef</Header>
                            <Image width='100%' size='medium' shape='rounded' src={supplier.image} />
                            <div style={{ fontSize: '1.6em', fontWeight: '800', marginTop: '0.5em', marginBottom: '0.4em' }}>{supplier.name}</div>
                            <div><strong>City:</strong> {supplier.city}</div>
                            {supplier.info}

                            <Divider section />

                            <Rail position='right'>
                                <Sticky context={contextRef} offset={50}>
                                    <Card fluid>
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
        )
    }
}
