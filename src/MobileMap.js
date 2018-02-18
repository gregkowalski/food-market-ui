import React from 'react'
import { Button } from 'semantic-ui-react'
import './MobileMap.css'
import { Map, Marker, CustomControl, Polygon } from './Map'
import Regions from './Map/Regions'
import Util from './Util'

// const __GAPI_KEY__ = 'AIzaSyBrqSxDb_BPNifobak3Ho02BuZwJ05RKHM';

export class MobileMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedItemId: props.selectedItemId,
            pickup: true,
            selectedRegionIds: []
        };
    }

    onMarkerClick(props, marker, e) {
        const selectedItemId = props.food_id;
        this.setState({ selectedItemId: selectedItemId });
        if (this.props.onMarkerClick) {
            this.props.onMarkerClick(selectedItemId);
        }
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

        if (this.props.onGeoSearch) {
            const geo = Util.getGeoBounds(map);
            this.props.onGeoSearch(geo);
        }
    }

    handleRegionSearch() {
        if (this.props.onRegionSelected) {
            const selectedRegionIds = this.state.selectedRegionIds;
            const selectedRegions = Regions.filter(r => selectedRegionIds.includes(r.id));
            this.props.onRegionSelected(selectedRegions);
        }
    }

    handlePickupClick = () => {
        if (this.state.pickup)
            return;

        this.setState({ pickup: true }, () => this.handleGeoSearch(this.map));
    }

    handleDeliveryClick = () => {
        if (!this.state.pickup)
            return;

        this.setState({ pickup: false }, () => this.handleRegionSearch([]));
    }

    render() {
        let selectedItemId = this.props.selectedItemId;
        if (!selectedItemId) {
            selectedItemId = this.state.selectedItemId;
        }

        let polygons;
        const showRegions = !this.state.pickup;
        if (showRegions) {
            polygons = Regions.map(region => {
                let borderColor = '#2aad8a';
                let fillColor = '#4cb99e';
                if (this.state.selectedRegionIds.includes(region.id)) {
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
                            this.setState({ selectedRegionIds: [clickedRegionId] }, () => this.handleRegionSearch());
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

        const infoStyle = {
            marginTop: '10px',
            marginLeft: '20px',
            backgroundColor: '#fff',
            lineHeight: '38px',
            paddingLeft: '5px',
            paddingRight: '5px',
            color: 'rgb(25,25,25)',
            fontFamily: 'Roboto,Arial,sans-serif',
            fontSize: '16px',
            border: '2px solid #fff',
            borderRadius: '3px',
            boxShadow: '0 2px 6px rgba(0,0,0,.3)',
        }

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
                onMapCreated={map => this.map = map}
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
                            <Button color={!this.state.pickup ? 'teal' : 'grey'} onClick={this.handleDeliveryClick}>
                                Delivery
                            </Button>
                        </div>
                    </div>
                </CustomControl>

                <CustomControl visible={!this.state.pickup} position={window.google.maps.ControlPosition.TOP_CENTER}>
                    <div style={infoStyle}>
                        Please click to select your delivery area
                    </div>
                </CustomControl>

                {polygons}
                {markers}
            </Map>
        )
    }
}

// <Map google={this.props.google} />

// export default GoogleApiWrapper({
//   apiKey: __GAPI_KEY__
// })(MapContainer)