import React from 'react'
import PropTypes from 'prop-types'
import { Button, Radio, Input, Icon } from 'semantic-ui-react'
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './SearchFilter.css'
import Util from '../../../services/Util'
import { DeliveryOptions } from '../../../Enums'
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete'
import RegionUtil from '../../../components/Map/RegionUtil'

export default class SearchFilter extends React.Component {

    state = {
        footerVisible: true,
        isValidAddress: false,
        addressText: ''
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            const { address, date, pickup } = nextProps;
            this.setState({
                address: address,
                addressText: address ? address.formatted_address : '',
                date: date,
                pickup: pickup,
                footerVisible: true,
                isValidAddress: address ? true : false,
                addressVisited: false
            });
        }
    }

    handleDateChange = (date) => {
        this.setState({ date: date });
    };

    handleDateClear = () => {
        this.setState({ date: undefined });
    }

    handleDateFocusChange = ({ focused }) => {
        this.setState({ dateFocused: focused });
    }

    handlePickupClick = () => {
        this.setState({ pickup: true, addressVisited: false });
    }

    handleDeliveryClick = () => {
        this.setState({ pickup: false });
    }

    handleAutocompleteChange = (addressText) => {
        this.setState({ addressText, isValidAddress: false });
    }

    handleAutocompleteSelect = (addressText) => {
        geocodeByAddress(addressText)
            .then(results => {
                const address = results[0];
                this.setState({ address, addressText: addressText, isValidAddress: true });
            })
            .catch(error => console.error('geocodeByAddress error', error));
    }

    handleAutocompleteFocus = () => {
        this.setState({ footerVisible: false, addressVisited: false });
    }

    handleAutocompleteBlur = () => {
        // Another hack to show the footer after the soft-keyboard
        // on android is retracted.  If we don't add a timeout here
        // then the footer flashes right below the autocomplete
        // before being rendered at the bottom of the window
        this.setState({ addressVisited: true });
        setTimeout(() => this.setState({ footerVisible: true }), 0);
    }

    handleAutocompleteClear = () => {
        // There's a bit of a race condition with the handleAutocompleteBlur
        // event.  The clear event (triggered by onClick) is fired right after
        // the blur event (since we're clicking on another div).  This is what
        // we want but adding the timeout just to ensure this triggers after
        // the handleAutocompleteBlur method.
        setTimeout(() => this.setState({ addressText: '', footerVisible: false, addressVisited: false }), 0);
    }

    handleFilterApply = () => {
        const { pickup, date, address } = this.state;
        this.props.onFilterApply({ pickup, date, address });
    }

    footerVisible(visible) {
        if (!this.props.visible || !this.state.footerVisible) {
            return { display: 'none' };
        }
        return {};
    }

    render() {
        const { onFilterHide, google } = this.props;
        const { dateFocused, date, pickup, addressText, isValidAddress, addressVisited } = this.state;

        if (!google) {
            return null;
        }

        const applyFilterDisabled = !pickup && (!addressText || !isValidAddress);
        const showAddressError = applyFilterDisabled && addressVisited;

        return (
            <div className='searchfilter'>

                <div className='searchfilter-header'>
                    <div></div>
                    <div className='searchfilter-header-center'>Filters</div>
                    <div className='searchfilter-header-right'>
                        <div onClick={onFilterHide}>&times;</div>
                    </div>
                </div>

                <div className='searchfilter-main'>

                    <div className='searchfilter-deliveryoptions'>
                        <div>How do you want to get your food?</div>
                        <Radio label='Pickup' name='delivery-option' checked={pickup} value={DeliveryOptions.pickup} onClick={this.handlePickupClick} />
                        <Radio label='Delivery' name='delivery-option' checked={!pickup} value={DeliveryOptions.delivery} onClick={this.handleDeliveryClick} />
                    </div>

                    {!pickup &&
                        <AddressAutocomplete google={google}
                            address={addressText}
                            error={showAddressError}
                            onChange={this.handleAutocompleteChange}
                            onSelect={this.handleAutocompleteSelect}
                            onFocus={this.handleAutocompleteFocus}
                            onBlur={this.handleAutocompleteBlur}
                            onClear={this.handleAutocompleteClear}
                        />
                    }

                    <div className='searchfilter-date'>
                        <div>When do you want your food?</div>
                        <SingleDatePicker
                            date={date}
                            isOutsideRange={Util.isDayOutsideRange}
                            onDateChange={this.handleDateChange}
                            focused={dateFocused}
                            onFocusChange={this.handleDateFocusChange}
                            numberOfMonths={1}
                            placeholder="Enter search date"
                            displayFormat={() => 'MMM D, YYYY'}
                        />
                        <span onClick={this.handleDateClear}>Clear date</span>
                    </div>

                </div>

                <div className='searchfilter-footer' style={this.footerVisible()}>
                    <Button disabled={applyFilterDisabled} onClick={this.handleFilterApply}>Show Dishes</Button>
                </div>

            </div>
        );
    }
}

SearchFilter.propTypes = {
    visible: PropTypes.bool.isRequired,
    date: PropTypes.object,
    pickup: PropTypes.bool.isRequired,
    address: PropTypes.object,

    onFilterHide: PropTypes.func.isRequired,
    onFilterApply: PropTypes.func.isRequired,
    
    google: PropTypes.object.isRequired,
}

class AddressAutocomplete extends React.Component {

    static propTypes = {
        google: PropTypes.object.isRequired,
    }

    handleClear = () => {
        if (this.props.onClear) {
            this.props.onClear();
        }
        this.input.focus();
    }

    setInputRef = (ref) => {
        this.input = ref;
    }

    render() {
        const { address, error, onChange, onSelect, onFocus, onBlur, google } = this.props;

        const searchOptions = {
            bounds: RegionUtil.LowerMainlandBounds(google),
            strictBounds: true,
            types: ['address'],
            componentRestrictions: { country: 'ca' }
        }

        const clearStyle = {};
        if (!address) {
            clearStyle.display = 'none';
        }

        return (
            <div className='searchfilter-address'>

                <PlacesAutocomplete
                    value={address}
                    onChange={onChange}
                    onSelect={onSelect}
                    searchOptions={searchOptions}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                        <div>
                            <div className='searchfilter-clearable'>
                                <Input error={error} ref={this.setInputRef}
                                    {...getInputProps({
                                        placeholder: error
                                            ? 'Please enter a delivery address'
                                            : 'Enter delivery address',
                                        onFocus: onFocus,
                                        onBlur: onBlur,
                                    })}
                                />
                                <Icon name='remove circle' style={clearStyle}
                                    className='searchfilter-clearable__clear' onClick={this.handleClear} />
                            </div>
                            {suggestions && suggestions.length > 0 &&
                                <div className="searchfilter-autocomplete-dropdown-container">
                                    {suggestions.map(suggestion => {
                                        const className = suggestion.active
                                            ? 'searchfilter-suggestion-item--active'
                                            : 'searchfilter-suggestion-item';

                                        const style = suggestion.active
                                            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                            : { backgroundColor: '#ffffff', cursor: 'pointer' };

                                        const markerClass = 'searchfilter-icon-marker' + (suggestion.active ? '--active' : '');
                                        return (
                                            <div {...getSuggestionItemProps(suggestion, { className, style })}>
                                                <span className={'searchfilter-icon ' + markerClass} />
                                                <span>{suggestion.description}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            }
                        </div>
                    )}
                </PlacesAutocomplete>

            </div>
        );
    }
}
