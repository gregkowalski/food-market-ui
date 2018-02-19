import React from 'react'
import { Image, Card, Rating, Divider } from 'semantic-ui-react'
import './DesktopMap.css'
import { Map, Marker, InfoWindow, Polygon, CustomControl } from './Map'
import Regions from './Map/Regions'
import PriceCalc from './PriceCalc'

// const __GAPI_KEY__ = 'AIzaSyBrqSxDb_BPNifobak3Ho02BuZwJ05RKHM';

export default class DesktopMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            selectedItemId: props.selectedItemId,
            selectedRegion: null,
            showDeliveryInstructions: !props.pickup
        };
    }

    handleMarkerClick = (props, marker, e) => {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
            selectedItemId: props.id
        });
    }

    handleMapClick = (props, map, e) => {
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

    handleInfoWindowClose = () => {
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

    handleRegionSearch(region) {
        if (this.props.onRegionSelected) {
            this.props.onRegionSelected(region);
        }
    }

    handleGeoSearch = (props, map, e) => {
        if (this.props.onGeoSearch) {
            this.props.onGeoSearch(map);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.pickup !== prevProps.pickup) {
            this.setState({ showDeliveryInstructions: !this.props.pickup });
            if (!this.props.pickup) {
                this.handleRegionSearch(this.state.selectedRegion);
            }
        }
    }

    handleDeliveryInstructionsClick = () => {
        this.setState({ showDeliveryInstructions: false });
    }

    render() {
        let selectedItem = this.state.selectedPlace;

        let selectedItemId = this.props.selectedItemId;
        if (selectedItemId < 0 || !selectedItemId) {
            selectedItemId = this.state.selectedItemId;
        }

        const { pickup } = this.props;
        const { showDeliveryInstructions } = this.state;

        let polygons;
        if (!pickup) {
            polygons = Regions.map(region => {
                let borderColor = '#2aad8a';
                let fillColor = '#4cb99e';
                if (this.state.selectedRegion === region) {
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
                            this.setState({
                                selectedRegion: region,
                                showDeliveryInstructions: false
                            }, () => this.handleRegionSearch(region));
                        }}
                    />);
            })
        }

        const markers = this.props.foods.map(foodItem => {
            return (
                <Marker
                    id={foodItem.food_id}
                    key={foodItem.food_id}
                    onClick={this.handleMarkerClick}
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
                centerAroundCurrentLocation={false}
                gestureHandling={this.props.gestureHandling}
                center={this.props.center}
                zoom={this.props.zoom}
                visible={this.props.visible}
                onClick={this.handleMapClick}
                onDragend={this.handleGeoSearch}
                onZoom_changed={this.handleGeoSearch}
                onMapCreated={this.props.onMapCreated}
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
                            href={'/foods/' + selectedItem.id}>
                            <Card style={{ border: 'solid 2px grey', margin: '4px 4px 4px 4px' }}>
                                <Card.Content>
                                    <Image width='100%' shape='rounded' src={selectedItem.image} />
                                    <Card.Header className='mapcontainer-foodcard-header'>
                                        <div className='marker-header'>${PriceCalc.getPrice(selectedItem.price)} · {selectedItem.header}</div>
                                        <div style={{ clear: 'both' }}></div>
                                    </Card.Header>
                                    <Card.Meta>
                                        <div style={{ display: 'inline-flex' }}>
                                            <Rating disabled={true} maxRating={5} rating={selectedItem.rating} size='mini' className='marker-rating-stars' />
                                            <div className='marker-rating-label'>{selectedItem.ratingCount} reviews</div>
                                        </div>
                                        <div className='marker-ingredients'>Ingredients: {selectedItem.meta}</div>
                                    </Card.Meta>
                                    <Card.Description>
                                        <div className='marker-description'>{selectedItem.description} </div>
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

// <Map google={this.props.google} />

// export default GoogleApiWrapper({
//   apiKey: __GAPI_KEY__
// })(MapContainer)