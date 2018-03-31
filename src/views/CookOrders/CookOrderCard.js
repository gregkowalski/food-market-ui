import React from 'react'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import { Segment, Divider, Image, Icon, Accordion, Button } from 'semantic-ui-react'
import './CookOrderCard.css'
import Constants from '../../Constants'
import OrderStatus from '../../data/OrderStatus'
import Colors from '../../data/Colors'
import PriceCalc from '../../services/PriceCalc'
import Url from '../../services/Url'

class CookOrderCard extends React.Component {

    state = { showDetails: false }

    navigateToFoodDetail = () => {
        this.props.history.push(Url.foodDetail(this.props.order.food_id));
    }

    handleAccept = () => {
        this.props.onAccept(this.props.order);
    }

    handleDecline = () => {
        this.props.onDecline(this.props.order);
    }

    handleCancel = () => {
        this.props.onCancel(this.props.order);
    }

    statusStyle(status) {
        let color = Colors.purple;
        if (status === OrderStatus.Accepted)
            color = Colors.purple;
        else if (status === OrderStatus.Declined)
            color = Colors.red;
        else if (status === OrderStatus.Cancelled)
            color = Colors.grey;

        return {
            backgroundColor: color,
            // color: 'white'
        }
    }

    render() {
        const { order } = this.props;
        const { food, cook, isAccepting, isDeclining, isCancelling } = order;
        const { showDetails } = this.state;

        return (
            <Segment className='cookordercard'>
                <div style={this.statusStyle(order.status)}>{order.status}</div>

                <Accordion>
                    <Accordion.Title active={showDetails} onClick={() => this.setState({ showDetails: !showDetails })}>
                        <div className='cookordercard-section large-font'>
                            <div>
                                <Icon name='dropdown' />
                                {food.title}
                                &nbsp; @ {order.time}
                                &nbsp; (${PriceCalc.getTotalPrice(food, order.quantity, order.pickup)} {Constants.Currency})
                                &nbsp; {order.pickup ? 'Pickup' : 'Delivery'}
                            </div>
                        </div>
                    </Accordion.Title>

                    {order.status === OrderStatus.Pending &&
                        <div>
                            <Button className='box-dropshadow' color='green' loading={isAccepting} onClick={this.handleAccept}>Accept</Button>
                            <Button className='box-dropshadow' color='red' loading={isDeclining} onClick={this.handleDecline}>Decline</Button>
                        </div>
                    }
                    {order.status === OrderStatus.Accepted &&
                        <div>
                            <Button className='box-dropshadow' color='orange' loading={isCancelling} onClick={this.handleCancel}>Cancel</Button>
                        </div>
                    }
                    <Accordion.Content active={showDetails}>
                        <Divider />
                        <div className='cookordercard-section'>
                            <div>Reservation code: {order.order_id}</div>
                            <div>Quantity: {order.quantity}</div>
                            <div>Total: ${PriceCalc.getTotalPrice(food, order.quantity, order.pickup)} {Constants.Currency}</div>
                        </div>
                        <Divider />
                        <div className='cookordercard-section normal-font'>
                            <div className='cookordercard-cook'>
                                <Image src={cook.image} circular size='mini' floated='left' />
                                <a href={Url.mailTo(cook.email, food.title)}>Message {cook.name}</a>
                            </div>
                            <div style={{ marginTop: '25px' }}>
                                <Icon name='calendar' size='big' /><a href='./'>Cancel order</a>
                            </div>
                        </div>
                    </Accordion.Content>
                </Accordion>
            </Segment>
        )
    }
}

export default withRouter(CookOrderCard);