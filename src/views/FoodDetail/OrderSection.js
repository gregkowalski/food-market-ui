import React from 'react'
import { Segment, Button } from 'semantic-ui-react'
import './index.css'
import FlagListing from '../../components/FlagListing'
import PriceCalc from '../../services/PriceCalc'
import DeliverySelector from './DeliverySelector'
import DateTimeSelector from './DateTimeSelector'
import QuantitySelector from './QuantitySelector'
import OrderPriceSummary from './OrderPriceSummary'
import OrderRequestHeader from './OrderRequestHeader'

const OrderSection = ({ food, pickup, date, time, quantity,
    onOrderButtonClick, onQuantityChange, onDateChange, onTimeChange, onDeliveryOptionChange }) => {

    return (
        <Segment>
            <OrderRequestHeader food={food} />
            <DeliverySelector pickup={pickup} onChange={onDeliveryOptionChange} />
            <DateTimeSelector date={date} time={time} onDateChange={onDateChange} onTimeChange={onTimeChange} />
            <QuantitySelector food={food} quantity={quantity} onChange={onQuantityChange} />
            <OrderPriceSummary food={food} quantity={quantity} pickup={pickup} />

            <Button animated='fade' fluid className='detail-desktop-button' onClick={onOrderButtonClick}>
                <Button.Content visible>
                    Request an Order
                </Button.Content>
                <Button.Content hidden>
                    ${PriceCalc.getTotal(food.price, quantity)} CAD
                </Button.Content>
            </Button>

            <div className='detail-card-charged-footnote'>You won't be charged yet</div>
            <FlagListing />
        </Segment>
    )
}

export default OrderSection;