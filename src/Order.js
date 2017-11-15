import React from 'react'
import './Order.css'
import { Button, Image, Icon, Message } from 'semantic-ui-react'
import { Accordion, Header, Divider, Form, Segment, Input } from 'semantic-ui-react'
import FoodItems from './data/FoodItems'
import Suppliers from './data/Suppliers'
import AWS from 'aws-sdk'
import Autocomplete from 'react-google-autocomplete';
import { Route } from 'react-router-dom'

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

    handleContactInfoChange = (e) => {
        let newState = { [e.target.name]: e.target.value };
        this.setState(newState);
    }

    handleAddressChange(place) {
        this.setState({ address: place.formatted_address })
    };

    handleQuantityChange(min, max, newValue) {
        if (newValue.length === 0) {
            this.setState({ quantity: newValue });
            return;
        }
        let newQuantity = parseInt(newValue, 10);
        if (!newQuantity || isNaN(newQuantity) || newQuantity < min || newQuantity > max)
            return;

        this.setState({ quantity: newQuantity });
    };

    handleClickQuantityChange(min, max, delta) {
        var quantity = this.state.quantity;
        if (quantity.length === 0) {
            quantity = 0;
        }
        let change = (delta > 0) ? 1 : -1;
        let newQuantity = quantity + change;
        if (newQuantity < min || newQuantity > max)
            return;

        let newState = { quantity: newQuantity };
        this.setState(newState);
    }

    handlePricingDetailsClick = (e, titleProps) => {
        const showPricingDetails = !this.state.showPricingDetails;
        this.setState({ showPricingDetails: showPricingDetails });
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

    isValidOrder(food) {
        return (this.state.quantity >= 1 && this.state.quantity <= food.availability)
            && this.state.firstName
            && this.state.lastName
            && this.state.phone
            && this.state.email
            && this.state.address;
    }

    handleOrderButtonClick(food) {
        if (!this.isValidOrder(food))
            return null;

        const aws_secret_access_key = '3Tb2qswQeoB31bMjlbM0OS1FEX0uEgzCF66LEbfK'
        const aws_access_key_id = 'AKIAI3G26HX46HETLCJQ'

        let creds = new AWS.Credentials(aws_access_key_id, aws_secret_access_key);
        AWS.config.update({
            region: 'us-west-2',
            credentials: creds
        });

        let address = (this.state.apt ? 'Apt ' + this.state.apt + ', ' : '') + this.state.address;
        let orderText = 'The following order was submitted at ' + new Date() + '\r\n' +
            'Item Id: ' + food.id + '\r\n' +
            'Name: ' + food.header + '\r\n' +
            'Quantity: ' + this.state.quantity + '\r\n' +
            'Total Price: ' + this.getTotal(food.price) + '\r\n\r\n' +

            'Contact Information\r\n' +
            'First Name: ' + this.state.firstName + '\r\n' +
            'Last Name: ' + this.state.lastName + '\r\n' +
            'Phone: ' + this.state.phone + '\r\n' +
            'Email: ' + this.state.email + '\r\n' +
            'Address: ' + address + '\r\n\r\n' +

            'Now go fill this order!'

        // Create sendEmail params 
        var params = {
            Destination: { /* required */
                // CcAddresses: [
                //   'EMAIL_ADDRESS',
                //   /* more items */
                // ],
                ToAddresses: [
                    'gregkowalski@hotmail.com',
                    /* more items */
                ]
            },
            Message: { /* required */
                Body: { /* required */
                    // Html: {
                    //     Charset: "UTF-8",
                    //     Data: "<h3>this is formatted crap, <strong>bro</strong></h3>"
                    // },
                    Text: {
                        Charset: "UTF-8",
                        Data: orderText
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'New Order: ' + food.header
                }
            },
            Source: '"Food Market" <foodmarket@cosmo-test.com>'
            //   ReplyToAddresses: [
            //       'EMAIL_ADDRESS',
            //     /* more items */
            //   ],
        };

        // Create the promise and SES service object
        var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
        return sendPromise;
    }

    render() {
        let id = this.getFoodItemId();
        // eslint-disable-next-line 
        let food = FoodItems.find(x => x.id == id);
        // eslint-disable-next-line 
        let supplier = Suppliers.find(x => x.id == food.supplierId);

        const { showPricingDetails } = this.state;

        return (
            <div>
                <Image src={food.image} className='food-image' />

                <div style={{ width: '90%', margin: '20px auto 0 auto', paddingBottom: '20px' }}>

                    <div style={{textAlign: 'center'}}>
                        <div style={{fontSize: '2em', fontWeight: 'bold'}}>{food.header}</div>
                        <div style={{fontSize: '1.2em', marginTop: '0.5em'}}>
                            by {supplier.name}
                            <Image avatar src={supplier.image} style={{ marginLeft: '10px' }} />
                        </div>
                    </div>

                    <Divider />

                    <Header>Quantity ({food.availability} available)</Header>
                    <Form.Group inline>
                        <Form.Field>
                            <Button icon='minus' size='large'
                                onClick={() => this.handleClickQuantityChange(1, food.availability, -1)} />
                            <Input type='number'
                                onChange={(e, { value }) => this.handleQuantityChange(1, food.availability, value)}
                                value={this.state.quantity} min={1} max={food.availability}
                                style={{ fontSize: '1.1em', width: '3.5em', marginLeft: '0.3em', marginRight: '0.5em' }} />
                            <Button icon='plus' size='large'
                                onClick={() => this.handleClickQuantityChange(1, food.availability, 1)} />
                        </Form.Field>
                    </Form.Group>
                    <div style={{ marginTop: '0.5em' }}>{this.state.quantity} x ${food.price} (per unit) = ${this.getBaseTotal(food.price)} (base price)</div>
                    <Message error header='Invalid Quantity' content='Please select at least 1 unit per order.'
                        hidden={true} />

                    <Divider />

                    <Form>

                        <Header>Contact Information</Header>
                        <Form.Group widths='equal'>
                            <Form.Input required name='firstName' label='First name' placeholder='First name' onChange={this.handleContactInfoChange} />
                            <Form.Input required name='lastName' label='Last name' placeholder='Last name' onChange={this.handleContactInfoChange} />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Input required name='phone' pattern="^(\+\d|\d)?\d{10}$" type='tel' label='Phone (7 digits with no dashes or spaces)' placeholder='Phone' onChange={this.handleContactInfoChange} />
                            <Form.Input required name='email' type='email' label='Email' placeholder='Email' onChange={this.handleContactInfoChange} />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Field required>
                                <label>Street Address</label>
                                <Autocomplete className="order-address"
                                    onPlaceSelected={(place) => this.handleAddressChange(place)}
                                    types={['address']} />
                            </Form.Field>
                            <Form.Input name='apt' label='Apartment' placeholder='Apartment' onChange={this.handleContactInfoChange} />
                        </Form.Group>

                        <Divider />

                        <Header>Order Summary</Header>

                        ${this.getTotal(food.price)} for {this.state.quantity} {food.header}

                        <Accordion>
                            <Accordion.Title active={showPricingDetails} onClick={this.handlePricingDetailsClick}>
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
                                        this helps run our platform and keep the lights on
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
                                    
                                    <Divider />
                                    <div>I agree to sales policy and customer refund policy.  I also agree to pay the total amount shown, which includes service fees.</div>
                        <OrderFormButton
                            linkTo="orderSuccess"
                            style={{ marginTop: '20px', height: '4em' }} fluid color='black'
                            onClick={() => this.handleOrderButtonClick(food)}>
                            Confirm order for ${this.getTotal(food.price)}
                        </OrderFormButton>
                    </Form >
                </div>
            </div>
        )
    }
}

class OrderFormButton extends React.Component {
    render() {
        return (
            <Route render={({ history }) => {
                let props = Object.assign({}, this.props);
                delete props.linkTo;
                delete props.onClick;
                return (
                    <Form.Button {...props}
                        onClick={(e) => {
                            let sendPromise = this.props.onClick(e);
                            if (!sendPromise)
                                return;

                            let linkTo = this.props.linkTo;
                            // Handle promise's fulfilled/rejected states
                            sendPromise.then(
                                function (data) {
                                    console.log(data.MessageId);
                                    if (linkTo) {
                                        history.push(linkTo);
                                    }
                                }).catch(
                                function (err) {
                                    console.error(err, err.stack);
                                });
                        }}>
                        {this.props.children}
                    </Form.Button>
                )
            }
            }
            />
        )
    }
}