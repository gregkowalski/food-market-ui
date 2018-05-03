import React from 'react'
import PropTypes from 'prop-types'
import { Image, Card, Rating, Divider } from 'semantic-ui-react'
import './DesktopMap.css'
import { Map, Marker, InfoWindow } from '../../../components/Map'
import PriceCalc from '../../../services/PriceCalc'
import MapUtil from '../../../services/MapUtil'
import Url from '../../../services/Url'

// const __GAPI_KEY__ = 'AIzaSyBrqSxDb_BPNifobak3Ho02BuZwJ05RKHM';

export default class DesktopMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedFood: {},
            selectedFoodId: props.selectedFoodId,
        };
    }

    handleMarkerClick = (props, marker, e) => {
        this.setState({
            selectedFood: props,
            activeMarker: marker,
            showingInfoWindow: true,
            selectedFoodId: props.id
        });
    }

    handleMapClick = (props, map, e) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null,
                selectedFood: {},
                selectedFoodId: null
            });
        }
    }

    handleInfoWindowClose = () => {
        this.setState({
            showingInfoWindow: false,
            activeMarker: null,
            selectedFood: {},
            selectedFoodId: null
        })
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
        return (foodItem.id === selectedFoodId) ? 9999 : null;
    }

    handleGeoSearch = (props, map) => {
        if (this.props.onGeoLocationChanged) {
            const geo = MapUtil.getGeoBounds(map);
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

    render() {
        const { selectedFood } = this.state;

        let selectedFoodId = this.props.selectedFoodId;
        if (!selectedFoodId) {
            selectedFoodId = this.state.selectedFoodId;
        }

        const { pickup, date, foods, selectedLocation } = this.props;

        const markers = foods && foods.map(foodItem => {
            return (
                <Marker
                    id={foodItem.food_id}
                    key={foodItem.food_id}
                    onClick={this.handleMarkerClick}
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
                onClick={this.handleMapClick}
                onDragend={this.handleGeoSearch}
                onZoom_changed={this.handleZoomChanged}
                onBounds_changed={this.handleBoundsChanged}
                onRecenter={this.handleGeoSearch}
            >
                {markers}
                {!pickup &&
                    <Marker icon='/assets/images/food-delivery-location.png' zIndex={5000} position={selectedLocation} />
                }

                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.handleInfoWindowClose}>

                    <div>
                        <a style={{ cursor: 'pointer' }} target='_blank'
                            href={Url.foodDetail(selectedFood.id, pickup, date)}>
                            <Card style={{ border: 'solid 2px grey', margin: '4px 4px 4px 4px' }}>
                                <Card.Content>
                                    <Image width='100%' shape='rounded' src={selectedFood.image} />
                                    <Card.Header className='mapcontainer-foodcard-header'>
                                        <div className='marker-header'>${PriceCalc.getPrice(selectedFood.price)} · {selectedFood.header}</div>
                                        <div style={{ clear: 'both' }}></div>
                                    </Card.Header>
                                    <Card.Meta>
                                        <div style={{ display: 'inline-flex' }}>
                                            <Rating disabled={true} maxRating={5} rating={selectedFood.rating} size='mini' className='marker-rating-stars' />
                                            <div className='marker-rating-label'>{selectedFood.ratingCount} reviews</div>
                                        </div>
                                        {/* {selectedFood.meta &&
                                            <div className='marker-ingredients' dangerouslySetInnerHTML={{ __html: selectedFood.meta.replace(/\\n/g, "<br />") }}></div>
                                        } */}
                                    </Card.Meta>
                                    <Card.Description>
                                        {selectedFood.meta &&
                                            <div className='marker-description' dangerouslySetInnerHTML={{ __html: selectedFood.meta.replace(/\\n/g, "<br />") }}></div>
                                        }
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        </a>
                        <Divider hidden />
                    </div>
                </InfoWindow>
            </Map>
        )
    }
}

DesktopMap.propTypes = {
    foods: PropTypes.arrayOf(PropTypes.shape({
        food_id: PropTypes.string.isRequired,
    })),
    pickup: PropTypes.bool.isRequired,
    onGeoLocationChanged: PropTypes.func.isRequired
}

// <Map google={this.props.google} />

// export default GoogleApiWrapper({
//   apiKey: __GAPI_KEY__
// })(MapContainer)