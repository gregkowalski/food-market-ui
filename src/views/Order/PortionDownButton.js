import React from 'react'
import { Button } from 'semantic-ui-react'

const PortionDownButton = ({ onClick, portion }) => {

    const downButtonProps = (portion) => {
        if (portion > 1) {
            return { color: 'purple' };
        }
        return { color: 'black', disabled: true };
    }

    return (
        // an empty onTouchStart causes :active to work on mobile iOS
        <Button basic circular icon='minus' {...downButtonProps(portion)}
            onClick={onClick} onTouchStart={() => { }} />
    );
}

export default PortionDownButton;