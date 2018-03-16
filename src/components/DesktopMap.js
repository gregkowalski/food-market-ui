import React from 'react'
import PropTypes from 'prop-types'
import { Image, Card, Rating, Divider } from 'semantic-ui-react'
import './DesktopMap.css'
import { Map, Marker, InfoWindow, Polygon, CustomControl } from './Map'
import Regions from './Map/Regions'
import PriceCalc from '../services/PriceCalc'
import Util from '../services/Util'
import Url from '../services/Url'

// const __GAPI_KEY__ = 'AIzaSyBrqSxDb_BPNifobak3Ho02BuZwJ05RKHM';

export default class DesktopMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedFood: {},
            selectedFoodId: props.selectedFoodId,
            showDeliveryInstructions: !props.pickup
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

    getMarkerImage(foodItem, selectedFoodId) {
        if (foodItem.id === selectedFoodId) {
            return '/assets/images/food-icon-selected1.png';
        }
        return '/assets/images/food-icon1.png';
    }

    getZIndex(foodItem, selectedFoodId) {
        return (foodItem.id === selectedFoodId) ? 9999 : null;
    }

    handleGeoSearch = (props, map) => {
        if (this.props.onGeoLocationChanged) {
            const geo = Util.getGeoBounds(map);
            this.props.onGeoLocationChanged(geo);
        }
    }

    handleBoundsChanged = (props, map) => {
        if (this.boundsLoaded)
            return;

        this.boundsLoaded = true;
        this.handleGeoSearch(props, map);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.pickup !== prevProps.pickup) {
            this.setState({ showDeliveryInstructions: !this.props.pickup });
        }
    }

    handleDeliveryInstructionsClick = () => {
        this.setState({ showDeliveryInstructions: false });
    }

    render() {
        const { selectedFood } = this.state;

        let selectedFoodId = this.props.selectedFoodId;
        if (!selectedFoodId) {
            selectedFoodId = this.state.selectedFoodId;
        }

        const { pickup, date, selectedRegion, foods } = this.props;
        const { showDeliveryInstructions } = this.state;

        let polygons;
        if (!pickup) {
            polygons = Regions.map(region => {
                let borderColor = '#2aad8a';
                let fillColor = '#4cb99e';
                if (Util.isEqualRegion(selectedRegion, region)) {
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
                            if (this.props.onRegionSelected) {
                                this.props.onRegionSelected(region);
                            }
                            this.setState({ showDeliveryInstructions: false });
                        }}
                    />);
            })
        }

        const markers = foods.map(foodItem => {
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

        const infoStyle = {
            marginTop: '10px',
            marginLeft: '20px',
            backgroundColor: '#fff',
            padding: '5px 5px 5px 5px',
            color: 'rgb(25,25,25)',
            fontFamily: 'Roboto,Arial,sans-serif',
            fontSize: '16px',
            border: '2px solid #fff',
            borderRadius: '3px',
            boxShadow: '0 2px 6px rgba(0,0,0,.3)',
            textAlign: 'center',
            cursor: 'pointer'
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
                gestureHandling={this.props.gestureHandling}
                center={this.props.center}
                zoom={this.props.zoom}
                visible={this.props.visible}
                onClick={this.handleMapClick}
                onDragend={this.handleGeoSearch}
                onZoom_changed={this.handleGeoSearch}
                onBounds_changed={this.handleBoundsChanged}
                >
                {polygons}
                {markers}

                <CustomControl visible={showDeliveryInstructions} position={window.google.maps.ControlPosition.TOP_CENTER}>
                    <div style={infoStyle} onClick={this.handleDeliveryInstructionsClick}>
                        Click region to select your delivery area
                    </div>
                </CustomControl>

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
                                        <div className='marker-ingredients'>Ingredients: {selectedFood.meta}</div>
                                    </Card.Meta>
                                    <Card.Description>
                                        <div className='marker-description'>{selectedFood.description} </div>
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
    selectedRegion: PropTypes.object,
    onGeoLocationChanged: PropTypes.func.isRequired,
    onRegionSelected: PropTypes.func.isRequired,
}

// <Map google={this.props.google} />

// export default GoogleApiWrapper({
//   apiKey: __GAPI_KEY__
// })(MapContainer)