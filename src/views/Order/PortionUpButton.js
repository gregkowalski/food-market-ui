import React from 'react'
import { Button } from 'semantic-ui-react'

const PortionUpButton = ({ onClick, portion }) => {

    const upButtonProps = (portion) => {
        if (portion < 9) {
            return { color: 'purple' };
        }
        return { color: 'black', disabled: true };
    }

    return (
        // an empty onTouchStart causes :active to work on mobile iOS
        <Button basic circular icon='plus' {...upButtonProps(portion)}
            onClick={onClick} onTouchStart={() => { }} />
    );
}

export default PortionUpButton;