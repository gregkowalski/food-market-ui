import React from 'react'
import { Image } from 'semantic-ui-react'
import './OrderExchangeMessage.css'
import Util from '../../services/Util'

const OrderExchangeMethod = ({ order }) => {
    const { pickup, buyer, handoff_start_date, handoff_end_date } = order;

    let deliveryOptionLabel = (<div><span className='orderexchangemessage-delivery'>delivery</span> order</div>);
    let deliveryInstruction = (<div>You are delivering this order to {Util.firstNonEmptyValue(buyer.name, buyer.username)} </div>);
    if (pickup) {
        deliveryOptionLabel = (<div>order <span className='orderexchangemessage-pickup'>pickup</span></div>);
        deliveryInstruction = (<div> {Util.firstNonEmptyValue(buyer.name, buyer.username)} is picking up this order from you </div>);
    }

    const startDate = Util.toCurrentTimezoneMoment(handoff_start_date).format('h A');
    const endDate = Util.toCurrentTimezoneMoment(handoff_end_date).format('h A');

    return (
        <div className='orderexchangemessage-label orderexchangemessage-pickup-spacing'>
            <div>
                {deliveryOptionLabel}
                <div>{startDate} to {endDate}</div>
                {buyer.image &&
                    <div><Image circular src={buyer.image} /></div>
                }
            </div>
            {deliveryInstruction}
        </div>
    );
}

export default OrderExchangeMethod;



