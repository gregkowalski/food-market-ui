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
        const { food, cook, quantity, pickup, date, time } = this.props;
        let { canRequestOrder } = this.props;

        let buttonText = 'Request an Order';
        let footnote = "You won't be charged yet";
        if (!cook.has_stripe_account) {
            canRequestOrder = false;
            buttonText = 'Coming Soon!';
            footnote = 'This food is unavailable for now';
        }

        return (
            <div>
                <div className='mobileorder'>

                    <OrderRequestHeader food={food} onClose={onHide} />
                    <DeliverySelector pickup={pickup} onChange={onDeliveryOptionChange} />
                    <QuantitySelector food={food} quantity={quantity} onChange={onQuantityChange} />
                    <DateTimeSelector food={food} date={date} time={time} onDateChange={onDateChange} onTimeChange={onTimeChange} />
                    <OrderPriceSummary food={food} quantity={quantity} pickup={pickup} />

                    <div className='mobileorder-footer'>
                        <Button disabled={!canRequestOrder} onClick={onOrderButtonClick}>{buttonText}</Button>
                        <div>{footnote}</div>
                    </div>

                </div>

            </div >
        );
    }
}