import React from 'react'
import { Divider } from 'semantic-ui-react'
import Constants from '../Constants.js'
import './OrderPriceSummary.css'
import PriceCalc from '../services/PriceCalc'

const OrderPriceSummary = ({ food, quantity, pickup }) => {

    const hideForPickup = (pickup) => {
        const style = {};
        if (pickup) {
            style.display = 'none';
        }
        return style;
    }

    return (
        <div className='orderpricesummary'>

            <div className='orderpricesummary-row'>
                <div className='orderpricesummary-left'>${PriceCalc.getTotal(food.price, quantity)} x {quantity} order size</div>
                <div className='orderpricesummary-right'>${PriceCalc.getTotal(food.price, quantity)}</div>
            </div>

            <Divider style={hideForPickup(pickup)} />

            <div className='orderpricesummary-row' style={hideForPickup(pickup)}>
                <div className='orderpricesummary-left'>Delivery Fee</div>
                <div className='orderpricesummary-right'>${Constants.DeliveryFee}</div>
            </div>

            <Divider />

            <div className='orderpricesummary-row'>
                <div className='orderpricesummary-left'>
                    <span style={{ fontWeight: 700 }}>Total</span>
                </div>
                <div className='orderpricesummary-right'>
                    <span style={{ fontWeight: 700 }}> ${PriceCalc.getTotalPrice(food, quantity, pickup)}</span>
                </div>
            </div>
        </div>
    );

}
export default OrderPriceSummary;