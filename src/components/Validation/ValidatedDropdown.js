import React from 'react'
import { Dropdown, Message } from 'semantic-ui-react'

const ValidatedDropdown = ({ input, meta, placeholder, options }) => {
    const { touched, error } = meta;
    const dropdown = Object.assign({}, input);

    const dropdownOnChange = (event, data) => {
        input.onChange(data.value);
    }

    const dropdownOnBlur = (event, data) => {
        input.onBlur(data.value);
    }

    dropdown.onChange = dropdownOnChange;
    dropdown.onBlur = dropdownOnBlur;
    return (
        <div>
            <Dropdown {...dropdown} fluid multiple search selection options={options} placeholder={placeholder} />
            {touched && error &&
                <Message error header={error.header} content={error.message} icon='exclamation circle' />
            }
        </div>
    );
}

export default ValidatedDropdown;