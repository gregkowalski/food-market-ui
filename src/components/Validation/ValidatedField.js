import React from 'react'
import { Input, Message } from 'semantic-ui-react'

const ValidatedField = ({ input, type, meta, placeholder, autoComplete, disabled }) => {
    const { touched, error, invalid, visited } = meta;
    const hasError = !disabled && (touched || visited) && invalid;
    return (
        <div>
            <Input {...input} disabled={disabled} type={type} placeholder={placeholder} error={hasError} autoComplete={autoComplete} />
            {touched && invalid && 
                <Message error header={error.header} content={error.message} icon='exclamation circle' />
            }
        </div>
    );
}

export default ValidatedField;