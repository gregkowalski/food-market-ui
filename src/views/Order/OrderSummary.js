import React from 'react'
import { Image, Icon } from 'semantic-ui-react'
import { Header, Divider, Segment } from 'semantic-ui-react'
import './OrderSummary.css'
import OrderTimes from '../../data/OrderTimes'
import PriceCalc from '../../services/PriceCalc'
import Constants from '../../Constants'

const OrderSummary = ({ food, pickup, quantity, date, time }) => {

    const timeText = OrderTimes[time] ? OrderTimes[time].text : '?';
    return (
        <Segment padded raised>
            <Header>
                <Icon name='shopping basket' /> My Order</Header>
            <Divider />
            <div className='order-summary-header'>
                <div>{food.title}</div>
                <Image src={food.imageUrls[0]} width='120px' height='80px' />
            </div>
            <Divider />
            <div className='order-summary-row large-font'>
                <div>{date.format('dddd, MMMM D, YYYY')}</div>
            </div>
            <div className='order-summary-row'>
                <div>{pickup ? 'Pickup' : 'Delivery'} from {timeText}</div>
            </div>
            <Divider />
            <div className='order-summary-row'>
                <div>${food.price} x {quantity} order size</div>
                <div>${PriceCalc.getTotal(food.price, quantity)}</div>
            </div>
            <Divider />
            {!pickup &&
                <div className='order-summary-row'>
                    <div>Delivery</div>
                    <div>${Constants.DeliveryFee}</div>
                </div>
            }
            {!pickup &&
                <Divider />
            }
            <div className='order-summary-row large-font'>
                <div>Total</div>
                <div>${PriceCalc.getTotalPrice(food, quantity, pickup)}</div>
            </div>
        </Segment>
    );
}

export default OrderSummary;