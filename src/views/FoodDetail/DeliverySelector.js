import React from 'react'
import Constants from '../../Constants.js'
import './DeliverySelector.css'

const DeliverySelector = ({ pickup, onChange }) => {

    const deliveryProps = (active) => {
        const props = {};
        if (active) {
            props.backgroundColor = 'rgba(228, 228, 228, 1)';
            // props.color = 'white';
            // props.border = '4px solid #99ede6';
            // props.boxShadow = '0px 0px 20px 8px rgba(76, 185, 158,0.75)';
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
