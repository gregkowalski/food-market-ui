import React from 'react'
import { Input, Message } from 'semantic-ui-react'

const ValidatedField = ({ input, type, meta, placeholder, autoComplete, disabled }) => {
    const { touched, error, invalid } = meta;
    const hasError = !disabled && invalid;
    console.log(`disabled=${disabled}, invalid=${invalid}`);
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