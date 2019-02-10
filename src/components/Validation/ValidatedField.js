import React from 'react'
import { Input, Message } from 'semantic-ui-react'

const ValidatedField = ({ input, type, meta, placeholder, autoComplete, disabled, action, onChangeIntercept }) => {
    const { touched, error, invalid, visited } = meta;
    const hasError = !disabled && (touched || visited) && invalid;

    const innerInput = Object.assign({}, input);
    innerInput.onChange = (event, data) => {
        input.onChange(data.value);
        if (onChangeIntercept) {
            onChangeIntercept(event, data);
        }
    }

    let baderror;
    const { value } = input;
    const bad = value === 'bad miaozhi';
    if (bad) {
        baderror = {
            header: 'invalid email',
            message: 'please enter good miaozhi email'
        };
    }
    return (
        <div className='validatedfield'>
            <Input {...innerInput}
                disabled={disabled}
                type={type}
                placeholder={placeholder}
                error={hasError || bad}
                autoComplete={autoComplete}
                action={action} />
            {touched && invalid &&
                <Message error header={error.header} content={error.message} icon='exclamation circle' />
            }
            {bad &&
                <Message error content={baderror.message} icon='exclamation circle' />
            }
        </div>
    );
}

export default ValidatedField;