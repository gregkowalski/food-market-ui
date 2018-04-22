import React from 'react'
import { Message } from 'semantic-ui-react'
import Autocomplete from '../Autocomplete'

const ValidatedAutocomplete = ({ input, meta, placeholder, autoComplete, className }) => {
    const onPlaceSelected = (place) => {
        input.onChange(place.formatted_address);
    }

    const autocompleteStyle = (isValid) => {
        const style = {};
        if (isValid) {
            style.border = '1px solid rgba(34, 36, 38, .15)';
        }
        else {
            style.border = '1px solid #e0b4b4';
            style.backgroundColor = '#fff6f6';
        }
        return style;
    }

    const { touched, error, visited, invalid } = meta;
    const hasError = visited && invalid;
    const divClassName = hasError ? 'error' : '';
    return (
        <div className={divClassName}>
            <Autocomplete className={className} style={autocompleteStyle(!hasError)}
                {...input}
                autoComplete={autoComplete}
                onPlaceSelected={onPlaceSelected}
                types={['address']}
                placeholder={placeholder}
                componentRestrictions={{ country: 'ca' }}
            />
            {touched && invalid &&
                <Message error header={error.header} content={error.message} icon='exclamation circle' />
            }
        </div>
    );
}

export default ValidatedAutocomplete;