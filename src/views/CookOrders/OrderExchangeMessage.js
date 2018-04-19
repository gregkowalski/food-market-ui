import React from 'react'
import { Image } from 'semantic-ui-react'
import './OrderExchangeMessage.css'



const OrderExchangeMethod = ({ pickup, buyer, time }) => {
    if (pickup === true) {
        return (
            <div className='orderexchangemessage-label orderexchangemessage-pickup-spacing'>
                <div>
                    <div>order <span className='orderexchangemessage-pickup'>pickup</span></div>
                    <div>{time}</div>
                    {buyer.image &&
                        <div><Image circular src={buyer.image} /></div>
                    }
                </div>
                <div> {buyer.name} is picking up this order from you </div>
            </div>
        )
    }
    return (
        <div className='orderexchangemessage-label orderexchangemessage-delivery-spacing'>
            <div>
                <div>
                    <span className='orderexchangemessage-delivery'>delivery</span> order</div>
                <div>{time}</div>
                {buyer.image &&
                    <div><Image circular src={buyer.image} /></div>
                }
            </div>
            <div>You are delivering this order to {buyer.name} </div>
        </div>
    )
}

export default OrderExchangeMethod;



