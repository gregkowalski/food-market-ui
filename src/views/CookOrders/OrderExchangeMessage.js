import React from 'react'
import { Image } from 'semantic-ui-react'
import './OrderExchangeMessage.css'



const OrderExchangeMethod = ({ pickup, buyer }) => {
    if (pickup === true) {
        return (
            <div className='orderexchangemessage-label'>
               <div>order pickup : </div>
               <div>{buyer.name} will meet you at <Image size='mini' circular src={buyer.image} />
               </div>
            </div>
        )
    }
    return (
        <div>delivery order<span> You are delivering this order to <Image size='mini' circular src={buyer.image} /> </span>
    </div>
    )
}

export default OrderExchangeMethod;


  
