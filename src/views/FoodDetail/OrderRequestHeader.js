import React from 'react'
import { Rating } from 'semantic-ui-react'
import './OrderRequestHeader.css'

const OrderRequestHeader = ({ food, onClose }) => {
    return (
        <div className='orderrequestheader-row orderrequestheader-border'>
            <div className='orderrequestheader-left'>
                {onClose &&
                    <div className='orderrequestheader-close' onClick={onClose}>
                        &times;
                    </div>
                }
                <div className='orderrequestheader-price'>
                    <span>${food.price} CAD</span>
                    <span> / order</span>
                </div>
                <div className='orderrequestheader-rating'>
                    <Rating disabled={true} maxRating={5} rating={food.rating} size='mini' />
                    <div>{food.ratingCount}</div>
                </div>
            </div>
            <div className='orderrequestheader-right'>
                <span>{food.title}</span>
            </div>
        </div>
    );
}

export default OrderRequestHeader;