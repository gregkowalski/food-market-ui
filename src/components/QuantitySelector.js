import React from 'react'
import { Button } from 'semantic-ui-react'
import './QuantitySelector.css'

const QuantitySelector = ({ food, quantity, onChange }) => {

    const handleQuantityIncrement = () => onChange(1);
    const handleQuantityDecrement = () => onChange(-1);

    return (
        <div className='quantityselector-quantity'>
            <div>How many? ({food.unit} per order)</div>
            <div>
                <Button circular basic color='teal' size='huge' icon='minus' onClick={handleQuantityDecrement} />
                <div>{quantity}</div>
                <Button circular basic color='teal' size='huge' icon='plus' onClick={handleQuantityIncrement} />
            </div>
        </div>
    );
}

export default QuantitySelector;