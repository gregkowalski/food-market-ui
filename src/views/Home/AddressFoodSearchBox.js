import React from 'react';
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'
import './AddressFoodSearchBox.css'
import Autocomplete from '../../components/Autocomplete'
import RegionUtil from '../../components/Map/RegionUtil'
import Util from '../../services/Util'
import Dom from '../../Dom'

const defaultPlaceholder = 'Enter your street address...';
const noResultsPlaceholder = 'No results found';
const unableToGeoSearchPlaceholder = 'Unable to find your location, please enter an address';

export default class AddressFoodSearchBox extends React.Component {

    static propTypes = {
        google: PropTypes.object.isRequired,
    }

    state = {
        address: '',
        addressPlaceholder: defaultPlaceholder
    };

    componentWillMount() {
        const { address } = this.props;
        if (address) {
            this.setState({ place: address, address: address.formatted_address });
        }
    }

    componentWillUnmount() {
        this.geocoder = null;
    }

    searchByCurrentLocation() {
        if (!navigator || !navigator.geolocation) {
            this.setState({ addressPlaceholder: unableToGeoSearchPlaceholder });
            return;
        }

        this.setState({ isSearching: true });

        const geoSearchTimeoutMs = 3000;
        const geoSearchMaxCacheAgeMs = 1000 * 60 * 15; // 15 minutes
        const watchId = navigator.geolocation.watchPosition(
            pos => {
                navigator.geolocation.clearWatch(watchId);
                this.setState({
                    isSearching: false,
                    addressPlaceholder: unableToGeoSearchPlaceholder
                });

                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                this.onSearchByLocation(undefined, { lat, lng });
            },
            error => {
                navigator.geolocation.clearWatch(watchId);
                console.error(error);
                this.setState({
                    isSearching: false,
                    addressPlaceholder: unableToGeoSearchPlaceholder
                });
            },
            {
                timout: geoSearchTimeoutMs,
                maximumAge: geoSearchMaxCacheAgeMs
            }
        );

        setTimeout(() => {
            navigator.geolocation.clearWatch(watchId);
            if (!this.geocoder)
                return;

            this.setState({
                isSearching: false,
                addressPlaceholder: unableToGeoSearchPlaceholder
            });
        }, geoSearchTimeoutMs);
    }

    handleAddressFocus = () => {
        // Reset the address placeholder to the default once the user clicks
        this.setState({ addressPlaceholder: defaultPlaceholder });
    }

    handleAddressSelected = (place) => {
        if (!place.geometry) {
            if (this.state.place) {
                const loc = Util.toLocation(this.props.google, this.state.place.geometry.location);
                this.onSearchByLocation(this.state.place, loc);
            }
            else {
                this.setState({ place: null, address: place.name });
            }
            return;
        }
        this.setState({ place: place, address: Util.toFormattedAddress(place) });
    }

    handleAddressChange = (e) => {
        this.setState({ place: null, address: e.target.value });
    }

    handleSearchButtonClick = () => {
        const { place, address } = this.state;
        const { google } = this.props;

        // If the user hasn't entered anything in the address search box
        // then we ask them to search by current GPS location
        if (!place && !address) {
            this.searchByCurrentLocation();
            return;
        }

        // If we already have a place selected (most likely due to the
        // address dropdown selection) then we just do the search for 
        // food in that area
        if (place) {
            const loc = Util.toLocation(google, place.geometry.location);
            this.onSearchByLocation(place, loc);
            return;
        }

        

        // The user entered an address or a partial address so let's
        // try to find out whether it's a real address using geocoder
        const request = {
            address,
            bounds: RegionUtil.LowerMainlandBounds(google),
            componentRestrictions: { country: 'ca' }
        };
        this.setState({ isSearching: true });

        if (!this.geocoder) {
            this.geocoder = new google.maps.Geocoder();
        }

        this.geocoder.geocode(request, (results, status) => {
            const newState = { isSearching: false };
            if (status === 'OK') {
                const firstPlace = results[0];
                if (!firstPlace.address_components || firstPlace.address_components.length < 8) {
                    // there was an address found but it's incomplete so we don't make any
                    // assumptions and let the user know that we couldn't find the address
                    status = 'INCOMPLETE_ADDRESS';
                }
                else {
                    // we found an address so let's just search in that area
                    // using a recursive call to this method
                    newState.place = firstPlace;
                    newState.address = Util.toFormattedAddress(firstPlace);
                    newState.addressPlaceholder = defaultPlaceholder;
                    this.setState(newState, this.handleSearchButtonClick)
                }
            }

            if (status !== 'OK') {
                // We couldn't find an address so let's just let the user know
                // that we didn't find results.  Also, if it's another error
                // that was somewhat unexpected, let's write it out to the console.
                if (status !== 'ZERO_RESULTS' && status !== 'INCOMPLETE_ADDRESS') {
                    console.error(status);
                }
                newState.address = '';
                newState.addressPlaceholder = noResultsPlaceholder;
                this.setState(newState);
            }
        });
    }

    onSearchByLocation(place, location) {
        if (this.props.onSearchByLocation) {
            this.props.onSearchByLocation({ place, location });
        }
    }

    handleClear = () => {
        this.setState({ place: null, address: '' });
        this.input.focus();
    }

    setInputRef = (input) => {
        this.input = input;
    }

    render() {
        const { address, addressPlaceholder, isSearching } = this.state;
        const { google } = this.props;
        if (!google)
            return null;

        const isDefaultPlaceholder = (addressPlaceholder === defaultPlaceholder);
        let className = 'addressfoodsearchbox';
        if (!isDefaultPlaceholder) {
            className += ' addressfoodsearchbox-result';
        }

        const clearStyle = {};
        if (!address) {
            clearStyle.display = 'none';
        }

        return (
            <div className={className}>

                <div className='addressfoodsearchbox-clearable'>
                    <Autocomplete
                        google={google}
                        onRef={this.setInputRef}
                        onFocus={this.handleAddressFocus}
                        onPlaceSelected={this.handleAddressSelected}
                        onChange={this.handleAddressChange}
                        types={['address']}
                        placeholder={addressPlaceholder}
                        componentRestrictions={{ country: 'ca' }}
                        value={address}
                        data-qa={Dom.Home.address}
                    />
                    <div className='addressfoodsearchbox-clearable__clear' style={clearStyle}
                        onClick={this.handleClear}>
                        &times;
                    </div>
                </div>

                <Button data-qa={Dom.Home.findFoodNearMe} fluid color='purple' loading={isSearching}
                    onClick={this.handleSearchButtonClick}>FIND FOOD NEAR ME</Button>
            </div>
        );
    }
}
