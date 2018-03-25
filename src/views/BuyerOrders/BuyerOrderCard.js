import React from 'react'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import { Segment, Divider, Image, Label, Icon, Accordion } from 'semantic-ui-react'
import './BuyerOrderCard.css'
import Constants from '../../Constants'
import PriceCalc from '../../services/PriceCalc'
import Url from '../../services/Url'

class BuyerOrderCard extends React.Component {

    state = { showDetails: false }

    navigateToFoodDetail = () => {
        this.props.history.push(Url.foodDetail(this.props.order.food_id));
    }

    render() {
        const { order } = this.props;
        const { food, cook } = order;
        const date = moment(order.date);

        const { showDetails } = this.state;

        let statusColor = 'grey';
        if (order.status === 'Accepted')
            statusColor = 'green';
        else if (order.status === 'Rejected')
            statusColor = 'red';

        return (
            <Segment raised>
                <Image id='buyerordercard-header-cook' src={cook.image} circular size='tiny' />
                <div className='buyerordercard'>
                    <div className='buyerordercard-header'>
                        <Image src={food.imageUrls[0]} onClick={this.navigateToFoodDetail} />
                        <div>
                            <Label size='large' color={statusColor}>{order.status}</Label>
                            <div className='large-font'>{food.title}</div>
                            <div className='buyerordercard-section'>
                                <div>{date.format('dddd, MMMM D')}</div>
                                <div>{order.time}</div>
                            </div>
                        </div>
                    </div>
                    <Divider />
                    <div className='buyerordercard-section buyerordercard-main large-font'>
                        <div>{order.pickup ? 'Pickup' : 'Delivery'} address</div>
                        <div>{order.address}</div>


                    </div>
                    <Divider />
                    <div className='buyerordercard-section'>
                        <Accordion>
                            <Accordion.Title active={showDetails} onClick={() => this.setState({ showDetails: !showDetails })}>
                                Additional details
                            <Icon name='dropdown' />
                            </Accordion.Title>
                            <Accordion.Content active={showDetails}>
                                <div>Reservation code: {order.order_id}</div>
                                <div>Quantity: {order.quantity}</div>
                                <div>Total: ${PriceCalc.getTotalPrice(food, order.quantity, order.pickup)} {Constants.Currency}</div>
                            </Accordion.Content>
                        </Accordion>
                    </div>
                    <Divider />
                    <div className='buyerordercard-contact normal-font'>
                        <div className='buyerordercard-cook'>
                            <Image src={cook.image} circular size='mini' />
                            <div>
                                <a href={Url.mailTo(cook.email, food.title)}>Message {cook.name}</a>
                            </div>
                        </div>
                        <div>
                            <Icon name='calendar' size='big' /><a href='./'>Cancel order</a>
                        </div>
                    </div>
                </div>

            </Segment>
        )
    }
}

export default withRouter(BuyerOrderCard);