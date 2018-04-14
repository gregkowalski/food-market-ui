import React from 'react'
import pluralize from 'pluralize'
import { Divider } from 'semantic-ui-react'
import { Constants } from '../../Constants'
import './OrderPriceSummary.css'
import PriceCalc from '../../services/PriceCalc'

const OrderPriceSummary = ({ food, quantity, pickup }) => {

    const hideForPickup = (pickup) => {
        const style = {};
        if (pickup) {
            style.display = 'none';
        }
        return style;
    }

    const quantityLabel = pluralize('order', quantity);

    return (
        <div className='orderpricesummary'>

            <div className='orderpricesummary-row'>
                <div className='orderpricesummary-left'>${food.price} x {quantity} {quantityLabel}</div>
                <div className='orderpricesummary-right'>${PriceCalc.getTotal(food.price, quantity)}</div>
            </div>

            <Divider style={hideForPickup(pickup)} />

            <div className='orderpricesummary-row' style={hideForPickup(pickup)}>
                <div className='orderpricesummary-left'>Delivery fee</div>
                <div className='orderpricesummary-right'>${Constants.DeliveryFee}</div>
            </div>

            <Divider />

            <div className='orderpricesummary-row orderpricesummary-total'>
                <div className='orderpricesummary-left'>
                    Total
                </div>
                <div className='orderpricesummary-right'>
                    ${PriceCalc.getTotalPrice(food, quantity, pickup)}
                </div>
            </div>
        </div>
    );

}
export default OrderPriceSummary;