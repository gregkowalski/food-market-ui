import React from 'react'
import PropTypes from 'prop-types'
import { Button, Radio, Input } from 'semantic-ui-react'
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './SearchFilter.css'
import Util from '../../../services/Util'
import { DeliveryOptions } from '../../../Enums'
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete'
import { LowerMainlandBounds } from '../../../components/Map/RegionUtil'

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

    getAddress = (place) => {
        if (place && place.geometry) {
            // const selectedLocation = Util.toLocation(place.geometry.location);
            // const region = RegionUtil.getRegionByPosition(selectedLocation);
            // this.props.actions.regionChanged(region);
            // this.props.actions.mapCenterChanged(selectedLocation);
            // this.props.actions.addressChanged(Util.toAddress(place));

            const street_number = this.getPart(place.address_components, 'street_number').short_name;
            const route = this.getPart(place.address_components, 'route').long_name;
            // const neighborhood = this.getPart(place.address_components, 'neighborhood');
            const locality = this.getPart(place.address_components, 'locality').short_name;
            // const administrative_area_level_2 = this.getPart(place.address_components, 'administrative_area_level_2');
            const administrative_area_level_1 = this.getPart(place.address_components, 'administrative_area_level_1').short_name;
            const country = this.getPart(place.address_components, 'country').long_name;
            // const postal_code = this.getPart(place.address_components, 'postal_code');

            const address = `${street_number} ${route}, ${locality}, ${administrative_area_level_1}, ${country}`;
            return address;
        }
    }

    getPart(components, typeName) {
        const part = components.find(x => x.types.indexOf(typeName) >= 0);
        if (part) {
            return part;
        }
        return {};
    }

    handleAutocompleteFocus = () => {
        this.setState({ footerVisible: false, addressVisited: false });
    }

    handleAutocompleteBlur = () => {
        // Another hack to show the footer after the soft-keyboard
        // on android is retracted.  If we don't add a timeout here
        // then the footer flashes right below the autocomplete
        // before being rendered at the bottom of the window
        setTimeout(() => {
            this.setState({ footerVisible: true, addressVisited: true });
        }, 0);
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
        const { onFilterHide } = this.props;
        const { dateFocused, date, pickup, addressText, isValidAddress, addressVisited } = this.state;

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
                        <AddressAutocomplete address={addressText}
                            error={showAddressError}
                            onChange={this.handleAutocompleteChange}
                            onSelect={this.handleAutocompleteSelect}
                            onFocus={this.handleAutocompleteFocus}
                            onBlur={this.handleAutocompleteBlur}
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
}

const AddressAutocomplete = ({ address, error, onChange, onSelect, onFocus, onBlur }) => {

    const searchOptions = {
        bounds: LowerMainlandBounds,
        strictBounds: true,
        types: ['address'],
        componentRestrictions: { country: 'ca' }
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
                        <Input error={error}
                            {...getInputProps({
                                placeholder: error
                                    ? 'Please enter a delivery address'
                                    : 'Enter delivery address',
                                // className: 'location-search-input'
                                onFocus: onFocus,
                                onBlur: onBlur,
                            })}
                        />
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


