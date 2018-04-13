import React from 'react'
import { Button } from 'semantic-ui-react'
import './MobileOrderRequest.css'
import DeliverySelector from './DeliverySelector'
import DateTimeSelector from './DateTimeSelector'
import QuantitySelector from './QuantitySelector'
import OrderPriceSummary from './OrderPriceSummary'
import OrderRequestHeader from './OrderRequestHeader'

export default class MobileOrderRequest extends React.Component {

    render() {
        const { onOrderButtonClick, onHide, onDateChange, onTimeChange, onQuantityChange, onDeliveryOptionChange } = this.props;
        const { food, quantity, pickup, date, time, canRequestOrder } = this.props;

        return (
            <div>
                <div className='mobileorder'>

                    <OrderRequestHeader food={food} onClose={onHide} />
                    <DeliverySelector pickup={pickup} onChange={onDeliveryOptionChange} />
                    <QuantitySelector food={food} quantity={quantity} onChange={onQuantityChange} />
                    <DateTimeSelector food={food} date={date} time={time} onDateChange={onDateChange} onTimeChange={onTimeChange} />
                    <OrderPriceSummary food={food} quantity={quantity} pickup={pickup} />

                    <div className='mobileorder-footer'>
                        <Button disabled={!canRequestOrder} onClick={onOrderButtonClick}>Request an Order</Button>
                        <div>You won't be charged yet</div>
                    </div>

                </div>

            </div >
        );
    }
}