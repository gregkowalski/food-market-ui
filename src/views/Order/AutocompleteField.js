import React from 'react'
import { Message } from 'semantic-ui-react'
import './DeliveryInfo.css'
import ClearableAutocomplete from '../../components/ClearableAutocomplete'
import Util from '../../services/Util'

const AutocompleteField = ({ field, form: { touched, errors, setFieldValue }, ...props }) => {

    const handlePlaceSelected = (place) => {
        const address = Util.toFormattedAddress(place);
        setFieldValue(field.name, address);
    }

    const handleClear = () => {
        setFieldValue(field.name, '');
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

    const error = errors[field.name];
    const hasError = touched && error;
    const divClassName = hasError ? 'error' : '';
    return (
        <ClearableAutocomplete
            style={autocompleteStyle(!hasError)}
            divClassName={divClassName}
            onPlaceSelected={handlePlaceSelected}
            onClear={handleClear}

            {...props}

            {...field}
        >
            {touched && error &&
                <Message error header={error.header} content={error.message} icon='exclamation circle' />
            }
        </ClearableAutocomplete>
    );
}

export default AutocompleteField;