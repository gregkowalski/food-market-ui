import React from 'react'
import './index.css'
import { Icon } from 'semantic-ui-react'

const FoodPrepSafetyMessage = ({ food }) => {
    if (food.states[0] === 'frozen') {
        return (<span><Icon color='teal' name='angle double right' />
            Frozen products must be fully cooked for food safety and quality.</span>)
    }
    else if (food.states[0] === 'cooked') {
        return (<span><Icon color='teal' name='angle double right' />
            Store your food properly: keep cold food cold and hot food hot!</span>)
    }
    return null;
}

export default FoodPrepSafetyMessage;