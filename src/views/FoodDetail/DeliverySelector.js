import React from 'react'
import Constants from '../../Constants.js'
import './DeliverySelector.css'

const DeliverySelector = ({ pickup, onChange }) => {

    const deliveryProps = (active) => {
        const props = {};
        if (active) {
            props.backgroundColor = '#b61095';
            props.color = '#ffffff';
        }
        return props;
    }

    const selectPickup = () => onChange(true);
    const selectDelivery = () => onChange(false);

    return (
        <div className='deliveryselector'>
            <div style={deliveryProps(pickup)} onClick={selectPickup}>
                Pickup
            </div>
            <div style={deliveryProps(!pickup)} onClick={selectDelivery}>
                Delivery +${Constants.DeliveryFee}
            </div>
        </div>
    );
}

export default DeliverySelector;
