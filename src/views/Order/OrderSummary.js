import React from 'react'
import { Image, Icon } from 'semantic-ui-react'
import { Header, Divider, Segment } from 'semantic-ui-react'
import './OrderSummary.css'
import Util from '../../services/Util'
import OrderPriceSummary from '../FoodDetail/OrderPriceSummary'


const OrderSummary = ({ food, pickup, quantity, date, time }) => {

    const timeText = time ? Util.orderTimeToString(time) : '?';
    return (
        <Segment padded className='order-summary'>
            <Header>
                <Icon name='shopping basket' />
                My Order
            </Header>
            <div className='order-summary-blurb'>
                Review the details of your order request.
                </div>
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

        <OrderPriceSummary food={food} quantity={quantity} pickup={pickup} />
            
        </Segment>
    );
}

export default OrderSummary;