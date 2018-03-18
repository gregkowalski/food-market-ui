import React from 'react'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import { Segment, Divider, Image, Label, Icon, Accordion } from 'semantic-ui-react'
import './CookOrderCard.css'
import Constants from '../../Constants'
import PriceCalc from '../../services/PriceCalc'
import Url from '../../services/Url'

class CookOrderCard extends React.Component {

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
            <Segment raised className='cookordercard'>
                <Label color={statusColor} ribbon>{order.status}</Label>
                <div className='cookordercard-header' onClick={this.navigateToFoodDetail}>
                    <div>{food.title}</div>
                    <Image src={food.imageUrls[0]} width='20%' height='80px' />
                </div>
                <Divider />
                <div className='cookordercard-section large-font'>
                    <div>{date.format('dddd, MMMM D')}</div>
                    <div>{order.time}</div>
                </div>
                <div className='cookordercard-section'>
                    <div>{order.pickup ? 'Pickup' : 'Delivery'} address: {order.address}</div>
                    <div><Image src={cook.image} circular size='mini' floated='left' />Your cook, {cook.name} </div>
                </div>
                <Divider />
                <div className='cookordercard-section'>
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
                <div className='cookordercard-section normal-font'>
                    <div className='cookordercard-cook'>
                        <Image src={cook.image} circular size='mini' floated='left' />
                        <a href={Url.mailTo(cook.email, food.title)}>Massage {cook.name}</a>
                    </div>
                    <div style={{ marginTop: '25px' }}>
                        <Icon name='calendar' size='big' /><a href='./'>Cancel order</a>
                    </div>
                </div>

            </Segment>
        )
    }
}

export default withRouter(CookOrderCard);