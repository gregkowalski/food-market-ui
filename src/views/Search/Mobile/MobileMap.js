import React from 'react'
import { Icon } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import './MobileMap.css'
import { Map, Marker, CustomControl } from '../../../components/Map'
import MapUtil from '../../../services/MapUtil'
import { Colors } from '../../../Constants'

export default class MobileMap extends React.Component {

    static propTypes = {
        google: PropTypes.object.isRequired
    }

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
            if (geo) {
                this.props.onGeoLocationChanged(geo);
            }
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
        const { foods, pickup, date, deliveryLocation, google } = this.props;
        const { selectedFoodId } = this.state;

        const markers = foods && foods.map(foodItem => {
            return (
                <Marker
                    google={google}
                    key={foodItem.food_id}
                    food_id={foodItem.food_id}
                    title={foodItem.title}
                    icon={this.getMarkerImage(foodItem, selectedFoodId)}
                    zIndex={this.getZIndex(foodItem, selectedFoodId)}
                    imageUrls={foodItem.imageUrls}
                    rating={foodItem.rating}
                    ratingCount={foodItem.ratingCount}
                    price={foodItem.price}
                    short_description={foodItem.short_description}
                    long_description={foodItem.long_description}
                    position={foodItem.position}
                    onClick={this.handleMarkerClick}
                />
            );
        });

        return (
            <Map
                google={google}
                zoomControl={true}
                zoomControlOptions={{ position: google.maps.ControlPosition.RIGHT_BOTTOM }}
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
                <CustomControl google={google} position={google.maps.ControlPosition.TOP_CENTER}>
                    <div className='mobilemap-buttons'>
                        <div onClick={this.props.onFilterClick} style={this.filterStyle(pickup, date)}>
                            {date &&
                                <span>
                                    {date.format('MMM D, YYYY')}
                                    <span className='filterbar-bullet'>&bull;</span>
                                </span>
                            }
                            {pickup ? 'Pickup' : 'Delivery'}
                        </div>
                        <div onClick={this.props.onListViewClick}>
                            <span>List</span>
                            <Icon name='list layout' color='purple' />
                        </div>
                    </div>
                </CustomControl>

                {markers}
                {!pickup &&
                    <Marker google={google} icon='/assets/images/food-delivery-location-v9.png' zIndex={5000} position={deliveryLocation} />
                }

            </Map>
        )
    }

    filterStyle(pickup, date) {
        if (!pickup || date) {
            return {
                backgroundColor: Colors.purple,
                color: Colors.white,
                fontWeight: 500
            }
        }
        return {
            backgroundColor: Colors.white,
            color: Colors.purple
        };
    }
}
