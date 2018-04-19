import React from 'react'
import moment from 'moment-timezone'
import { Image } from 'semantic-ui-react'
import './OrderExchangeMessage.css'
import { Constants } from '../../Constants'

const OrderExchangeMethod = ({ order }) => {
    const { pickup, buyer, handoff_start_date, handoff_end_date } = order;

    let deliveryOptionLabel = (<div><span className='orderexchangemessage-delivery'>delivery</span> order</div>);
    let deliveryInstruction = (<div>You are delivering this order to {buyer.name} </div>);
    if (pickup) {
        deliveryOptionLabel = (<div>order <span className='orderexchangemessage-pickup'>pickup</span></div>);
        deliveryInstruction = (<div> {buyer.name} is picking up this order from you </div>);
    }

    const timezone = Constants.Timezone;
    const startDate = moment(handoff_start_date, moment.ISO_8601).tz(timezone).format('h A');
    const endDate = moment(handoff_end_date, moment.ISO_8601).tz(timezone).format('h A');

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



