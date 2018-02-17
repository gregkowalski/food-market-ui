import React from 'react'
import { Button } from 'semantic-ui-react'
import './MobileMap.css'
import { Map, Marker, InfoWindow, CustomControl, Polygon } from './Map'
import Regions from './Map/Regions'

// const __GAPI_KEY__ = 'AIzaSyBrqSxDb_BPNifobak3Ho02BuZwJ05RKHM';

export class MobileMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showingInfoWindow: false,
            selectedItemId: props.selectedItemId,
            pickup: true,
            selectedRegions: []
        };
    }

    onMarkerClick(props, marker, e) {
        const selectedItemId = props.food_id;
        this.setState({
            // turn off info window for mobile map
            // this should just scroll to the clicked item in the carousel
            showingInfoWindow: false,
            selectedItemId: selectedItemId
        });
        if (this.props.onMarkerClick) {
            this.props.onMarkerClick(selectedItemId);
        }
    }

    onMapClick(props, map, e) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        console.log({ lat, lng });
        if (this.state.showingInfoWindow) {
            this.setState({ showingInfoWindow: false });
        }
    }

    onInfoWindowClose() {
        this.setState({ showingInfoWindow: false });
    }

    getMarkerImage(foodItem, selectedItemId) {
        if (foodItem.food_id === selectedItemId) {
            return '/assets/images/food-icon-selected1.png';
        }
        return '/assets/images/food-icon1.png';
    }

    getZIndex(foodItem, selectedItemId) {
        return (foodItem.food_id === selectedItemId) ? 9999 : null;
    }

    handleGeoSearch(map) {
        if (!this.state.pickup) {
            return;
        }

        let bounds = map.getBounds();
        let ne = bounds.getNorthEast();
        let sw = bounds.getSouthWest();
        console.log(`ne=(${ne.lat()}, ${ne.lng()})`);
        console.log(`sw=(${sw.lat()}, ${sw.lng()})`);
        let geo = {
            ne_lat: ne.lat(),
            ne_lng: ne.lng(),
            sw_lat: sw.lat(),
            sw_lng: sw.lng(),
        }
        if (this.props.onGeoSearch) {
            this.props.onGeoSearch(geo);
        }
    }

    handleRegionSearch(selectedRegionIds) {
        this.setState({ showingInfoWindow: false });
        if (this.props.onRegionSelected) {
            const selectedRegions = Regions.filter(r => selectedRegionIds.includes(r.id));
            this.props.onRegionSelected(selectedRegions);
        }
    }

    handlePickupClick = () => {
        const newPickup = !this.state.pickup;
        const newState = { pickup: newPickup };
        console.log(`pickup: ${newPickup}`);

        if (newPickup) {
            // initialize pickup option
            if (this.props.onGeoSearch) {
                this.props.onGeoSearch();
            }
            newState.showingInfoWindow = false;
        }
        else {
            // initialize delivery option
            const newSelectedRegions = [];
            newState.selectedRegions = newSelectedRegions;
            newState.showingInfoWindow = true;
            this.handleRegionSearch(newSelectedRegions);
        }
        this.setState(newState);
    }

    render() {
        let selectedItemId = this.props.selectedItemId;
        if (!selectedItemId) {
            selectedItemId = this.state.selectedItemId;
        }

        let polygons;
        const showRegions = !this.state.pickup;
        // if (this.props.showRegions) {
        if (showRegions) {
            polygons = Regions.map(region => {
                let borderColor = '#2aad8a';
                let fillColor = '#4cb99e';
                if (this.state.selectedRegions.includes(region.id)) {
                    borderColor = '#4286f4';
                    fillColor = '#115dd8';
                }
                return (
                    <Polygon
                        key={region.id}
                        id={region.id}
                        paths={region.paths}
                        strokeColor={borderColor}
                        strokeOpacity={0.8}
                        strokeWeight={2}
                        fillColor={fillColor}
                        fillOpacity={0.35}
                        onClick={(props, map, e) => {
                            const lat = e.latLng.lat();
                            const lng = e.latLng.lng();
                            console.log({ lat, lng });
                            console.log(`clicked ${props.id}`);

                            const clickedRegionId = props.id;

                            // const newSelectedRegions = this.state.selectedRegions.filter(r => r !== clickedRegionId);
                            // const includes = this.state.selectedRegions.includes(clickedRegionId);
                            // if (!includes) {
                            //     newSelectedRegions.push(clickedRegionId);
                            // }
                            const newSelectedRegions = [clickedRegionId];
                            this.setState({ selectedRegions: newSelectedRegions });
                            this.handleRegionSearch(newSelectedRegions);
                        }}
                    />);
            })
        }

        const markers = this.props.foods.map(foodItem => {
            return (
                <Marker
                    food_id={foodItem.food_id}
                    key={foodItem.food_id}
                    header={foodItem.header}
                    icon={this.getMarkerImage(foodItem, selectedItemId)}
                    zIndex={this.getZIndex(foodItem, selectedItemId)}
                    image={foodItem.image}
                    rating={foodItem.rating}
                    ratingCount={foodItem.ratingCount}
                    price={foodItem.price}
                    meta={foodItem.meta}
                    description={foodItem.description}
                    position={foodItem.position}
                    onClick={(props, marker, e) => this.onMarkerClick(props, marker, e)}
                />
            );
        });

        const style1 = {
            color: 'rgb(25,25,25)',
            fontFamily: 'Roboto,Arial,sans-serif',
            fontSize: '16px',
            lineHeight: '38px',
            paddingLeft: '5px',
            paddingRight: '5px',
        };

        const style2 = {
            backgroundColor: '#fff',
            border: '2px solid #fff',
            borderRadius: '3px',
            boxShadow: '0 2px 6px rgba(0,0,0,.3)',
            cursor: 'pointer',
            marginBottom: '22px',
            textAlign: 'center'
        };

        return (
            <Map
                google={window.google}
                zoomControl={true}
                zoomControlOptions={{ position: window.google.maps.ControlPosition.LEFT_TOP }}
                mapTypeControl={false}
                scaleControl={true}
                streetViewControl={false}
                rotateControl={false}
                fullscreenControl={false}
                clickableIcons={false}
                scrollwheel={true}
                centerAroundCurrentLocation={false}
                gestureHandling={this.props.gestureHandling}
                center={this.props.center}
                zoom={this.props.zoom}
                visible={this.props.visible}
                onClick={(props, map, e) => this.onMapClick(props, map, e)}
                onDragstart={(props, map, e) => {
                    console.log('drag start');
                }}
                onDragend={(props, map, e) => {
                    console.log('drag end');
                    this.handleGeoSearch(map);
                }}
                onZoom_changed={(props, map, e) => {
                    console.log('zoom changed');
                    this.handleGeoSearch(map);
                }}
            >

                <CustomControl>
                    <div style={style1} onClick={this.props.onListViewClick}>
                        <div style={style2}>List View</div>
                    </div>
                </CustomControl>

                <CustomControl>
                    <div style={style1} onClick={this.props.onFilterClick}>
                        <div style={style2}>Filter</div>
                    </div>
                </CustomControl>

                <CustomControl position={window.google.maps.ControlPosition.LEFT_TOP}>
                    <div>
                        <div>
                            <Button style={{ marginBottom: '5px' }} color={this.state.pickup ? 'teal' : 'grey'} onClick={this.handlePickupClick}>
                                Pickup
                            </Button>
                        </div>
                        <div>
                            <Button color={!this.state.pickup ? 'teal' : 'grey'} onClick={this.handlePickupClick}>
                                Delivery
                            </Button>
                        </div>
                    </div>
                </CustomControl>

                {polygons}
                {/* {circles} */}
                {/* {circle} */}
                {markers}

                <InfoWindow visible={this.state.showingInfoWindow} onClose={() => this.onInfoWindowClose()}>
                    <div style={{ maxWidth: '200px', fontSize: '16px' }}>
                        Please click to select your delivery area
                    </div>
                </InfoWindow>
            </Map>
        )
    }
}

// <Map google={this.props.google} />

// export default GoogleApiWrapper({
//   apiKey: __GAPI_KEY__
// })(MapContainer)