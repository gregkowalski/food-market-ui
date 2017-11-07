import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import './Order.css'
import { Button, Card, Image, Rating, Icon } from 'semantic-ui-react'
import { Accordion, Header, Divider, Grid, Form, Segment, Input, Container } from 'semantic-ui-react'
import FoodItems from './data/FoodItems'
import Suppliers from './data/Suppliers'

export default class Order extends React.Component {

    state = {
        quantity: 1,
        showPricingDetails: false,
        serviceFeeRate: 0.03
    };

    getFoodItemId() {
        return this.props.match.params.id;
    }

    componentDidMount() {
        let id = this.getFoodItemId();
        // eslint-disable-next-line 
        let item = FoodItems.find(x => x.id == id);
        document.title = item.header;
    }

    handleChange = (e, { value }) => this.setState({ value });

    handleQuantityChange = (e, { value }) => {
        let newState = {
            quantity: value,
            showPricingDetails: this.state.showPricingDetails
        };
        this.setState(newState);
    };

    handleClick = (e, titleProps) => {
        const showPricingDetails = !this.state.showPricingDetails;

        this.setState({
            showPricingDetails: showPricingDetails
        });
    };

    getTotal(unitPrice) {
        let total = (this.state.quantity * unitPrice * (1 + this.state.serviceFeeRate));
        return total.toFixed(2);
    }

    getBaseTotal(unitPrice) {
        let baseTotal = this.state.quantity * unitPrice;
        return baseTotal.toFixed(2);
    }

    getServiceFee(unitPrice) {
        let fee = this.state.quantity * unitPrice * this.state.serviceFeeRate;
        return fee.toFixed(2);
    }

    render() {
        let id = this.getFoodItemId();
        // eslint-disable-next-line 
        let food = FoodItems.find(x => x.id == id);
        // eslint-disable-next-line 
        let supplier = Suppliers.find(x => x.id == food.supplierId);

        const { value } = this.state;
        const { showPricingDetails } = this.state;

        return (
            <div>
                <Image src={food.image} className='food-image' />

                <div style={{ width: '90%', margin: '20px auto 0 auto', paddingBottom: '20px' }}>
                    <Form>
                        <Header as='h2' style={{ textAlign: 'center' }}>
                            <div>{food.header}</div>
                            <div>by {supplier.name}
                                <Image avatar src={supplier.image} style={{ marginLeft: '10px' }} />
                            </div>
                        </Header>

                        <Divider />

                        <Header>Quantity</Header>
                        <Form.Group inline>
                            <Form.Field>
                                <Input type='number' value={this.state.quantity}
                                    min={1} max={food.availability} onChange={this.handleQuantityChange}
                                    style={{ height: '2em', width: '5em', marginTop: '-3px', marginRight: '0.5em' }} />
                                <span>x ${food.price} (per {food.header})</span>
                            </Form.Field>

                        </Form.Group>

                        <Divider />

                        <Header>Contact Information</Header>
                        <Form.Group widths='equal'>
                            <Form.Input label='First name' placeholder='First name' />
                            <Form.Input label='Last name' placeholder='Last name' />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Input label='Mobile' placeholder='Mobile' />
                            <Form.Input label='Email' placeholder='Email' />
                        </Form.Group>

                        <Divider />

                        <Header>Order Summary</Header>

                        ${this.getTotal(food.price)} for {this.state.quantity} {food.header}

                        <Accordion>
                            <Accordion.Title active={showPricingDetails} onClick={this.handleClick}>
                                <Icon name='dropdown' />
                                See pricing details
                                        </Accordion.Title>
                            <Accordion.Content active={showPricingDetails}>
                                <Segment style={{ maxWidth: '400px', minWidth: '250px' }}>
                                    <Header as='h5'>Payment Breakdown</Header>
                                    <div>
                                        <div className='align-left'>
                                            ${food.price} x {this.state.quantity} {food.header}
                                        </div>
                                        <div className='align-right'>
                                            ${this.getBaseTotal(food.price)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className='align-left'>
                                            Service fee
                                            </div>
                                        <div className='align-right'>
                                            ${this.getServiceFee(food.price)}
                                        </div>
                                    </div>
                                    <div style={{
                                        fontSize: '0.8em', marginLeft: '10px', color: 'gray',
                                        maxWidth: '250px'
                                    }}>
                                        this helps run our platform and to offer
                                            a standard of quality and health
                                        </div>

                                    <Divider />

                                    <div>
                                        <div className='align-left'>
                                            Total (CAD)
                                            </div>
                                        <div className='align-right'>
                                            ${this.getTotal(food.price)}
                                        </div>
                                    </div>
                                </Segment>
                            </Accordion.Content>
                        </Accordion>
                        <Form.Button style={{ marginTop: '20px', height: '4em' }} fluid color='black'>
                            Place Order for ${this.getTotal(food.price)}
                        </Form.Button>
                    </Form >
                </div>
            </div>
        )
    }
}