import React from 'react'
import { Image, Card, Rating, Divider, Button } from 'semantic-ui-react'
import './DesktopMap.css'
import { Map, Marker, InfoWindow, Circle, CustomControl, Polygon } from './Map'
import PriceCalc from './PriceCalc'
import Regions from './Map/Regions'

// const __GAPI_KEY__ = 'AIzaSyBrqSxDb_BPNifobak3Ho02BuZwJ05RKHM';

export class DesktopMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            selectedItemId: props.selectedItemId
        };
    }

    onMarkerClick(props, marker, e) {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
            selectedItemId: props.id
        });
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

    handleRegionSearch(region) {
        if (this.props.onRegionSelected) {
            this.props.onRegionSelected(region);
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
            newState.selectedPlace = null;
            newState.showingInfoWindow = true;
            this.handleRegionSearch(null);
        }
        this.setState(newState);
    }

    render() {
        let item = this.state.selectedPlace;
        let selectedItemId = this.props.selectedItemId;
        if (selectedItemId < 0) {
            selectedItemId = this.state.selectedItemId;
        }

        let polygons;
        if (this.props.showRegions) {
            polygons = Regions.map(region => {
                let borderColor = '#2aad8a';
                let fillColor = '#4cb99e';
                if (this.state.selectedRegionId === region.id) {
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
                            this.setState({ selectedRegionId: props.id });
                            this.handleRegionSearch(region);
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
                    id={foodItem.food_id}
                    key={foodItem.food_id}
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

        const { pickup } = this.state;

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

                {polygons}
                {/* {circles} */}
                {/* {circle} */}
                {markers}

                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={() => this.onInfoWindowClose()}>

                    <div>
                        <a style={{ cursor: 'pointer' }} target='_blank'
                            href={'/foods/' + item.id}>
                            <Card style={{ border: 'solid 2px grey', margin: '4px 4px 4px 4px' }}>
                                <Card.Content>
                                    <Image width='100%' shape='rounded' src={item.image} />
                                    <Card.Header className='mapcontainer-foodcard-header'>
                                        <div className='marker-header'>${PriceCalc.getPrice(item.price)} · {item.header}</div>
                                        <div style={{ clear: 'both' }}></div>
                                    </Card.Header>
                                    <Card.Meta>
                                        <div style={{ display: 'inline-flex' }}>
                                            <Rating disabled={true} maxRating={5} rating={item.rating} size='mini' className='marker-rating-stars' />
                                            <div className='marker-rating-label'>{item.ratingCount} reviews</div>
                                        </div>
                                        <div className='marker-ingredients'>Ingredients: {item.meta}</div>
                                    </Card.Meta>
                                    <Card.Description>
                                        <div className='marker-description'>{item.description} </div>
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