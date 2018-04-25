import React from 'react';
import { Button } from 'semantic-ui-react'
import './AddressFoodSearchBox.css'
import Autocomplete from '../../components/Autocomplete'
import { LowerMainlandBounds } from '../../components/Map/RegionUtil'

const defaultPlaceholder = 'Enter your street address';
const noResultsPlaceholder = 'No results found';
const unableToGeoSearchPlaceholder = 'Unable to find your location, please enter an address';

export default class AddressFoodSearchBox extends React.Component {

    state = {
        address: '',
        addressPlaceholder: defaultPlaceholder
    };

    componentWillMount() {
        this.geocoder = new window.google.maps.Geocoder();
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
                this.onSearchByLocation({ lat, lng });
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

    handleAddressKeyDown = (event) => {
        // This handling is needed for when the user pressed enter to
        // select the item from google autocomplete box and then
        // presses enter again to search.
        if (event.key === 'Enter') {
            const { place, address } = this.state;
            if (!address && !place) {
                this.searchByCurrentLocation();
            }
            else {
                this.handleSearchButtonClick();
            }
        }
    }

    handleAddressSelected = (place) => {
        if (!place.geometry) {
            if (this.state.place) {
                const loc = this.state.place.geometry.location;
                this.onSearchByLocation({ lat: loc.lat(), lng: loc.lng() });
            }
            else {
                this.setState({ place: null, address: place.name });
            }
            return;
        }
        this.setState({ place: place, address: place.formatted_address });
    }

    handleAddressChange = (e) => {
        this.setState({ place: null, address: e.target.value });
    }

    handleSearchButtonClick = () => {
        const { place, address } = this.state;
        if (!place && !address) {
            this.searchByCurrentLocation();
            return;
        }

        if (place) {
            const loc = place.geometry.location;
            this.onSearchByLocation({ lat: loc.lat(), lng: loc.lng() });
            return;
        }

        const request = {
            address,
            bounds: LowerMainlandBounds,
            componentRestrictions: { country: 'ca' }
        };
        this.setState({ isSearching: true });
        this.geocoder.geocode(request, (results, status) => {
            const newState = { isSearching: false };
            if (status === 'OK') {
                const firstPlace = results[0];
                newState.place = firstPlace
                newState.address = firstPlace.formatted_address;
                newState.addressPlaceholder = defaultPlaceholder;
            }
            else {
                if (status !== 'ZERO_RESULTS') {
                    console.error(status);
                }
                newState.address = '';
                newState.addressPlaceholder = noResultsPlaceholder;
            }
            this.setState(newState);
        });
    }

    onSearchByLocation(loc) {
        if (this.props.onSearchByLocation) {
            this.props.onSearchByLocation(loc);
        }
    }

    render() {
        const { address, addressPlaceholder, isSearching } = this.state;

        const isDefaultPlaceholder = (addressPlaceholder === defaultPlaceholder);
        let className = 'addressfoodsearchbox';
        if (!isDefaultPlaceholder) {
            className += ' addressfoodsearchbox-result';
        }

        return (
            <div className={className}>
                <Autocomplete
                    onFocus={this.handleAddressFocus}
                    onPlaceSelected={this.handleAddressSelected}
                    onChange={this.handleAddressChange}
                    onKeyDown={this.handleAddressKeyDown}
                    types={['address']}
                    placeholder={addressPlaceholder}
                    componentRestrictions={{ country: 'ca' }}
                    value={address}
                />
                <Button fluid color='purple' loading={isSearching}
                    onClick={this.handleSearchButtonClick}>FIND FOOD NEAR ME</Button>
            </div>
        );
    }
}