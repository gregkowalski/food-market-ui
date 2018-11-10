import React from 'react'
import { Icon } from 'semantic-ui-react'
import Autocomplete from './Autocomplete'
import './ClearableAutocomplete.css'
import withGoogle from '../hoc/WithGoogleHoc'

export class ClearableAutocomplete extends React.Component {

    setInputRef = (input) => {
        this.input = input;
    }

    handleClear = () => {
        const { onClear } = this.props;
        if (onClear) {
            onClear();
            if (this.input) {
                this.input.focus();
            }
        }
    }

    render() {
        const { divClassName, onClear, children, google, ...rest } = this.props;

        if (!google) {
            return null;
        }

        const clearStyle = {};
        if (!rest.value) {
            clearStyle.display = 'none';
        }

        return (
            <div id='clearable-autocomplete' className={divClassName}>
                <Autocomplete
                    google={google}
                    onRef={this.setInputRef}
                    types={['address']}
                    componentRestrictions={{ country: 'ca' }}
                    {...rest}
                />
                <Icon id='clearable-autocomplete__clear' name='remove circle'
                    style={clearStyle} onClick={this.handleClear} />

                {children}

            </div>
        );
    }
}

export default withGoogle(ClearableAutocomplete);