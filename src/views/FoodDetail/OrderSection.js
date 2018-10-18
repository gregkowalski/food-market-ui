import React from 'react'
import { Segment, Button } from 'semantic-ui-react'
import './index.css'
import { Constants } from '../../Constants'
// import FlagListing from '../../components/FlagListing'
import PriceCalc from '../../services/PriceCalc'
import DeliverySelector from './DeliverySelector'
import DateTimeSelector from './DateTimeSelector'
import QuantitySelector from './QuantitySelector'
import OrderPriceSummary from './OrderPriceSummary'
import OrderRequestHeader from './OrderRequestHeader'

const OrderSection = ({ food, cook, pickup, date, time, quantity, canRequestOrder,
    onOrderButtonClick, onQuantityChange, onDateChange, onTimeChange, onDeliveryOptionChange }) => {

    let buttonText = 'Request an Order';
    let footnote = "You won't be charged yet";
    if (!cook.has_stripe_account) {
        canRequestOrder = false;
        buttonText = 'Coming Soon!';
        footnote = 'This food is unavailable for now';
    }

    return (
        <Segment>
            <OrderRequestHeader food={food} />
            <DeliverySelector pickup={pickup} onChange={onDeliveryOptionChange} />
            <QuantitySelector food={food} quantity={quantity} onChange={onQuantityChange} />            
            <DateTimeSelector food={food} cook={cook} date={date} time={time} onDateChange={onDateChange} onTimeChange={onTimeChange} />
            <OrderPriceSummary food={food} quantity={quantity} pickup={pickup} />

            <Button animated='fade' disabled={!canRequestOrder} fluid className='detail-desktop-button' onClick={onOrderButtonClick}>
                <Button.Content visible>
                    {buttonText}
                </Button.Content>
                <Button.Content hidden>
                    ${PriceCalc.getTotal(food.price, quantity)} {Constants.Currency}
                </Button.Content>
            </Button>

            <div className='detail-card-charged-footnote'>{footnote}</div>
        </Segment>
        //  <FlagListing />
    )
}

export default OrderSection;