import React from 'react'
import PropTypes from 'prop-types'
import { Image, Card, Rating, Divider } from 'semantic-ui-react'
import './DesktopMap.css'
import { Map, Marker, InfoWindow } from '../../../components/Map'
import PriceCalc from '../../../services/PriceCalc'
import MapUtil from '../../../services/MapUtil'
import Url from '../../../services/Url'

export default class DesktopMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedFood: {},
            hoveredFoodId: props.hoveredFoodId,
        };
    }

    handleMarkerClick = (props, marker, e) => {
        this.setState({
            selectedFood: props,
            activeMarker: marker,
            showingInfoWindow: true,
            hoveredFoodId: props.id
        });
    }

    handleMapClick = (props, map, e) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null,
                selectedFood: {},
                hoveredFoodId: null
            });
        }
    }

    handleInfoWindowClose = () => {
        this.setState({
            showingInfoWindow: false,
            activeMarker: null,
            selectedFood: {},
            hoveredFoodId: null
        })
    }

    getMarkerImage = (foodItem, hoveredFoodId) => {
        const { pickup } = this.props;

        if (pickup) {
            if (foodItem.id === hoveredFoodId) {
                return '/assets/images/food-icon-selected.png';
            }
            return '/assets/images/food-icon.png';
        }
        else {
            if (foodItem.id === hoveredFoodId) {
                return '/assets/images/food-delivery-selected.png';
            }
            return '/assets/images/food-delivery.png';
        }
    }

    getZIndex(foodItem, hoveredFoodId) {
        return (foodItem.id === hoveredFoodId) ? 9999 : null;
    }

    handleGeoSearch = (props, map) => {
        if (this.props.onGeoLocationChanged) {
            const geo = MapUtil.getDesktopGeoBounds(map);
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

    render() {
        const { selectedFood } = this.state;

        let hoveredFoodId = this.props.hoveredFoodId;
        if (!hoveredFoodId) {
            hoveredFoodId = this.state.hoveredFoodId;
        }

        const { pickup, foods, selectedLocation, google } = this.props;
        if (!google) {
            return null;
        }

        const markers = foods && foods.map(foodItem => {
            return (
                <Marker
                    google={google}
                    id={foodItem.food_id}
                    key={foodItem.food_id}
                    onClick={this.handleMarkerClick}
                    title={foodItem.title}
                    icon={this.getMarkerImage(foodItem, hoveredFoodId)}
                    zIndex={this.getZIndex(foodItem, hoveredFoodId)}
                    imageUrls={foodItem.imageUrls}
                    rating={foodItem.rating}
                    ratingCount={foodItem.ratingCount}
                    price={foodItem.price}
                    short_description={foodItem.short_description}
                    long_description={foodItem.long_description}
                    position={foodItem.position}
                />
            );
        });

        return (
            <Map
                google={google}
                zoomControl={true}
                zoomControlOptions={{ position: google.maps.ControlPosition.LEFT_TOP }}
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
                    <Marker google={google} icon='/assets/images/food-delivery-location-v9.png' zIndex={5000} position={selectedLocation} />
                }

                <InfoWindow
                    google={google}
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.handleInfoWindowClose}>

                    <div>
                        <a style={{ cursor: 'pointer' }} target='_blank' rel='noopener noreferrer'
                            href={Url.foodDetail(selectedFood.id)}>
                            <Card style={{ border: 'solid 2px grey', margin: '4px 4px 4px 4px' }}>
                                <Card.Content>
                                    {selectedFood.imageUrls &&
                                        <Image width='100%' shape='rounded' src={selectedFood.imageUrls[0]} />
                                    }
                                    <Card.Header className='mapcontainer-foodcard-header'>
                                        <div className='marker-header'>${PriceCalc.getPrice(selectedFood.price)} · {selectedFood.title}</div>
                                        <div style={{ clear: 'both' }}></div>
                                    </Card.Header>
                                    <Card.Meta>
                                        <div style={{ display: 'inline-flex' }}>
                                            <Rating className='marker-rating-stars' disabled={true} maxRating={5} rating={selectedFood.rating} size='mini' />
                                            <div className='marker-rating-label'>{selectedFood.ratingCount} reviews</div>
                                        </div>
                                    </Card.Meta>
                                    <Card.Description>
                                        {selectedFood.short_description &&
                                            <div className='marker-description' dangerouslySetInnerHTML={{ __html: selectedFood.short_description.replace(/\\n|\n/g, "<br />") }}></div>
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
    onGeoLocationChanged: PropTypes.func.isRequired,
    google: PropTypes.object.isRequired
}
