import React from 'react'
import { Message } from 'semantic-ui-react'
import ClearableAutocomplete from '../ClearableAutocomplete'
import Util from '../../services/Util'

const ValidatedAutocomplete = ({ input, meta, placeholder, autoComplete, className }) => {
    const handlePlaceSelected = (place) => {
        const address = Util.toFormattedAddress(place);
        input.onChange(address);
    }

    const handleClear = () => {
        input.onChange('');
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
    const hasError = (touched || visited) && invalid;
    const divClassName = hasError ? 'error' : '';
    return (
        <ClearableAutocomplete
            style={autocompleteStyle(!hasError)}
            className={className}
            divClassName={divClassName}
            placeholder={placeholder}
            autoComplete={autoComplete}

            onPlaceSelected={handlePlaceSelected}
            onClear={handleClear}

            {...input}
        >
            {touched && invalid &&
                <Message error header={error.header} content={error.message} icon='exclamation circle' />
            }
        </ClearableAutocomplete>
    );
}

export default ValidatedAutocomplete;