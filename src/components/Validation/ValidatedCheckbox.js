import React from 'react'
import { Checkbox, Message } from 'semantic-ui-react'

const ValidatedCheckbox = ({ input, meta, ...props }) => {
    const { error, invalid } = meta;
    const { value, ...inputProps } = input;
    return (
        <div>
            <Checkbox {...inputProps} {...props} checked={value} />
            {invalid && 
                <Message error header={error.header} content={error.message} icon='exclamation circle' />
            }
        </div>
    );
}

export default ValidatedCheckbox;