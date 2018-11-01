import React from 'react'
import { Button } from 'semantic-ui-react'
import './QuantitySelector.css'
import { Constants } from '../../Constants'
import Dom from '../../Dom'

const QuantitySelector = ({ food, quantity, onChange }) => {

    const min = 1;
    const max = Constants.MaxFoodQuantity;
    const handleQuantityIncrement = () => onChange(1);
    const handleQuantityDecrement = () => onChange(-1);

    const buttonProps = (disabled) => {
        const props = {
            color: 'purple'
        };
        if (disabled) {
            props.color = 'grey';
            props.disabled = true;
        }
        return props;
    }

    return (
        <div className='quantityselector'>
            <div className='quantityselector-quantity'>
                <div>How many orders?</div>
                <div>
                    <Button data-qa={Dom.FoodDetail.decrementQuantity} circular basic {...buttonProps(quantity <= min)} size='huge' icon='minus' onClick={handleQuantityDecrement} />
                    <div>{quantity}</div>
                    <Button data-qa={Dom.FoodDetail.incrementQuantity} circular basic {...buttonProps(quantity >= max)} size='huge' icon='plus' onClick={handleQuantityIncrement} />
                </div>
            </div>
        </div>
    );
}

export default QuantitySelector;