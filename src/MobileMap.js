import React from 'react'
import { Image, Card, Rating, Divider, Button } from 'semantic-ui-react'
import './MobileMap.css'
import { Map, Marker, InfoWindow, Circle, CustomControl } from './Map'
import PriceCalc from './PriceCalc'
import { Polygon } from './Map/components/Polygon';
import Regions from './Map/Regions'

// const __GAPI_KEY__ = 'AIzaSyBrqSxDb_BPNifobak3Ho02BuZwJ05RKHM';

export class MobileMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            selectedItemId: props.selectedItemId,
            pickup: true,
            selectedRegions: []
        };
    }

    onMarkerClick(props, marker, e) {
        const selectedItemId = props.id;
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            // turn off info window for mobile map
            // this should just scroll to the clicked item in the carousel
            showingInfoWindow: true,
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
            this.setState({
                showingInfoWindow: false,
                activeMarker: null,
                selectedPlace: {},
                selectedItemId: -1
            });
        }
    }

    onInfoWindowClose() {
        this.setState({
            showingInfoWindow: false,
            activeMarker: null,
            selectedPlace: {},
            selectedItemId: -1
        })
    }

    getMarkerImage(foodItem, selectedItemId) {
        if (foodItem.id === selectedItemId) {
            return '/assets/images/food-icon-selected1.png';
        }
        return '/assets/images/food-icon1.png';
    }

    getZIndex(foodItem, selectedItemId) {
        return (foodItem.id === selectedItemId) ? 9999 : null;
    }

    handleGeoSearch(map) {
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
        if (this.props.onRegionSelected) {
            const selectedRegions = Regions.filter(r => selectedRegionIds.includes(r.id));
            this.props.onRegionSelected(selectedRegions);
        }
    }

    handlePickupClick = () => {
        console.log(`pickup: ${!this.state.pickup}`);
        this.setState({ pickup: !this.state.pickup });
    }

    render() {
        let item = this.state.selectedPlace;
        let selectedItemId = this.props.selectedItemId;
        if (selectedItemId < 0) {
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
                            const includes = this.state.selectedRegions.includes(clickedRegionId);
                            const newSelectedRegions = this.state.selectedRegions.filter(r => r !== clickedRegionId);
                            if (!includes) {
                                newSelectedRegions.push(clickedRegionId);
                            }

                            this.setState({ selectedRegions: newSelectedRegions });
                            this.handleRegionSearch(newSelectedRegions);
                        }}
                    />);
            })
        }

        const radius = 300;

        let circle;
        if (this.state.hoveredFoodId) {
            const food = this.props.foods.find(f => f.id === this.state.hoveredFoodId);
            if (food) {
                circle = <Circle
                    key={food.id}
                    center={food.position}
                    radius={radius}
                    strokeColor='#4cb99e'
                    strokeOpacity={0.8}
                    strokeWeight={2}
                    fillColor='#2aad8a'
                    fillOpacity={0.35}
                />
            }
        }

        // const circles = this.props.foods.map(food =>
        //     <Circle
        //         key={food.id}
        //         center={food.position}
        //         radius={radius}
        //         strokeColor='#4cb99e'
        //         strokeOpacity={0.8}
        //         strokeWeight={2}
        //         fillColor='#2aad8a'
        //         fillOpacity={0.35}
        //     />
        // );

        const markers = this.props.foods.map(foodItem => {
            return (
                <Marker
                    id={foodItem.id}
                    key={foodItem.id}
                    onClick={(props, marker, e) => this.onMarkerClick(props, marker, e)}
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
                    onMouseover={() => {
                        console.log('mouse_over: foodItem.id=' + foodItem.id);
                        this.setState({ hoveredFoodId: foodItem.id });
                    }}
                    onMouseout={() => {
                        console.log('mouse_out: foodItem.id=' + foodItem.id);
                        this.setState({ hoveredFoodId: null });
                    }}
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
                onGetCurrentPosition={this.props.onGetCurrentPosition}
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

                <InfoWindow
                    // marker={this.state.activeMarker}
                    // position={this.props.center}
                    visible={this.state.showingInfoWindow}
                    onClose={() => this.onInfoWindowClose()}>
                    <div>
                        Please click on a region to select foods with delivery option...
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