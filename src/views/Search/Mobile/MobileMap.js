import React from 'react'
import './MobileMap.css'
import { Map, Marker, CustomControl } from '../../../components/Map'
import MapUtil from '../../../services/MapUtil'

// const __GAPI_KEY__ = 'AIzaSyBrqSxDb_BPNifobak3Ho02BuZwJ05RKHM';

export default class MobileMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFoodId: props.selectedFoodId
        };
    }

    getMarkerImage = (foodItem, selectedFoodId) => {
        const { pickup } = this.props;

        if (pickup) {
            if (foodItem.id === selectedFoodId) {
                return '/assets/images/food-icon-selected.png';
            }
            return '/assets/images/food-icon.png';
        }
        else {
            if (foodItem.id === selectedFoodId) {
                return '/assets/images/food-delivery-selected.png';
            }
            return '/assets/images/food-delivery.png';
        }
    }

    getZIndex(foodItem, selectedFoodId) {
        return (foodItem.food_id === selectedFoodId) ? 9999 : null;
    }

    handleMarkerClick = (props, marker) => {
        if (this.props.onMarkerClick) {
            this.props.onMarkerClick(props.food_id);
        }
    }

    handleGeoSearch = (props, map) => {
        if (this.props.onGeoLocationChanged) {
            const geo = MapUtil.getMobileGeoBounds(map);
            this.props.onGeoLocationChanged(geo);
        }
    }

    handleZoomChanged = (props, map) => {
        const maxZoom = 16;
        const zoom = map.getZoom();
        if (zoom > maxZoom) {
            map.setZoom(maxZoom);
        }
        else if (zoom < maxZoom) {
            this.handleGeoSearch(props, map);
        }
    }

    handleBoundsChanged = (props, map) => {
        if (this.boundsLoaded)
            return;

        this.boundsLoaded = true;
        this.handleGeoSearch(props, map);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.selectedFoodId !== nextProps.selectedFoodId) {
            this.setState({ selectedFoodId: nextProps.selectedFoodId });
        }
    }

    render() {
        const { foods, pickup, deliveryLocation } = this.props;
        const { selectedFoodId } = this.state;

        const markers = foods && foods.map(foodItem => {
            return (
                <Marker
                    food_id={foodItem.food_id}
                    key={foodItem.food_id}
                    header={foodItem.header}
                    icon={this.getMarkerImage(foodItem, selectedFoodId)}
                    zIndex={this.getZIndex(foodItem, selectedFoodId)}
                    image={foodItem.image}
                    rating={foodItem.rating}
                    ratingCount={foodItem.ratingCount}
                    price={foodItem.price}
                    meta={foodItem.meta}
                    description={foodItem.description}
                    position={foodItem.position}
                    onClick={this.handleMarkerClick}
                />
            );
        });

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
                gestureHandling={this.props.gestureHandling}
                center={this.props.center}
                initialCenter={this.props.initialCenter}
                zoom={this.props.zoom}
                visible={this.props.visible}
                onDragend={this.handleGeoSearch}
                onZoom_changed={this.handleZoomChanged}
                onBounds_changed={this.handleBoundsChanged}
                onRecenter={this.handleGeoSearch}
            >
                <CustomControl position={window.google.maps.ControlPosition.TOP_CENTER}>
                    <div className='mobilemap-buttons'>
                        <div className='mobilemap-buttons-listview' onClick={this.props.onListViewClick}>List View</div>
                        <div className='mobilemap-buttons-filter' onClick={this.props.onFilterClick}>Filters: {pickup ? 'Pickup' : 'Delivery'}</div>
                    </div>
                </CustomControl>

                {markers}
                {!pickup &&
                    <Marker icon='/assets/images/food-delivery-location.png' zIndex={5000} position={deliveryLocation} />
                }

            </Map>
        )
    }
}

// <Map google={this.props.google} />

// export default GoogleApiWrapper({
//   apiKey: __GAPI_KEY__
// })(MapContainer)