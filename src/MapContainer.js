import React from 'react'
import { Image, Card, Rating, Divider } from 'semantic-ui-react'
import './MapContainer.css'
import { Map, Marker, InfoWindow, Circle, CustomControl } from './Map'
import PriceCalc from './PriceCalc'
import { Polygon } from './Map/components/Polygon';

// const __GAPI_KEY__ = 'AIzaSyBrqSxDb_BPNifobak3Ho02BuZwJ05RKHM';

const google = window.google;

const dt = {
    id: 'dt',
    paths: [
        new google.maps.LatLng(49.28315, -123.09949),
        new google.maps.LatLng(49.29334, -123.13073),
        new google.maps.LatLng(49.293, -123.14361),
        new google.maps.LatLng(49.28449, -123.14361),
        new google.maps.LatLng(49.27094, -123.12764),
        new google.maps.LatLng(49.27296, -123.11554),
    ]
};
const kits = {
    id: 'kits',
    paths: [
        new google.maps.LatLng(49.26557, -123.12335),
        new google.maps.LatLng(49.27895, -123.14155),
        new google.maps.LatLng(49.2743, -123.17708),
        new google.maps.LatLng(49.2733, -123.19167),
        new google.maps.LatLng(49.2631, -123.19013),
        new google.maps.LatLng(49.24977, -123.19133),
        new google.maps.LatLng(49.24966, -123.16172),
        new google.maps.LatLng(49.24871, -123.12468)
    ]
};

const regions = [dt, kits];

export class MapContainer extends React.Component {

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

    convertMetersToDegrees(meters) {
        const earthCircumference = 40075000;
        const metersToDegrees = 360 / earthCircumference;
        return meters * metersToDegrees;
    }

    getAdjustedPosition(pos) {
        return {
            lat: pos.lat + this.getDegreeAdjustment(pos.lat),
            lng: pos.lng + this.getDegreeAdjustment(pos.lng),
        }
    }

    getDegreeAdjustment(loc) {
        const hash = this.getHashCode(loc);
        const sign = (hash % 2 === 1) ? 1 : -1;
        const offset = 50;
        let locAdjustment = sign * (hash % 100 + (hash / 100 % 100) + offset);
        //console.log(locAdjustment);
        return this.convertMetersToDegrees(locAdjustment);
    }

    getHashCode(value) {
        let str = value.toString();
        let hash = 0, i, chr;
        if (str.length === 0) return hash;
        for (i = 0; i < str.length; i++) {
            chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    render() {
        // const style = {
        //   width: '100vw',
        //   height: '100vh'
        // }

        let item = this.state.selectedPlace;
        let selectedItemId = this.props.selectedItemId;
        if (selectedItemId < 0) {
            selectedItemId = this.state.selectedItemId;
        }

        // this.vancouverDowntown = [
        //     { lat: 49.270796, lng: -123.120689 },
        //     { lat: 49.270292, lng: -123.126783 },
        //     { lat: 49.277683, lng: -123.138199 },
        //     { lat: 49.285690, lng: -123.144207 },
        //     { lat: 49.293640, lng: -123.132706 },
        //     { lat: 49.289497, lng: -123.116741 },
        //     { lat: 49.283563, lng: -123.104811 },
        //     { lat: 49.275668, lng: -123.105841 },
        //     { lat: 49.273204, lng: -123.113823 },
        //     { lat: 49.270796, lng: -123.120689 }
        // ];

        let polygons;
        if (this.props.showRegions) {
            polygons = regions.map(region => {
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
                centerAroundCurrentLocation={true}
                gestureHandling={this.props.gestureHandling}
                onClick={(props, map, e) => this.onMapClick(props, map, e)}
                center={this.props.center}
                zoom={this.props.zoom}
                visible={this.props.visible}
                onBounds_changed={(props, map) => {
                    // let bounds = map.getBounds();
                    // let ne = bounds.getNorthEast();
                    // let sw = bounds.getSouthWest();
                    // console.log(`ne=(${ne.lat()}, ${ne.lng()})`);
                    // console.log(`sw=(${sw.lat()}, ${sw.lng()})`);
                }}
                onDragstart={(props, map, e) => {
                    console.log('drag start');
                }}
                onDragend={(props, map, e) => {
                    console.log('drag end');
                    // let bounds = map.getBounds();
                    // let ne = bounds.getNorthEast();
                    // let sw = bounds.getSouthWest();
                    // console.log(`ne=(${ne.lat()}, ${ne.lng()})`);
                    // console.log(`sw=(${sw.lat()}, ${sw.lng()})`);
                    this.handleGeoSearch(map);
                }}
                onZoom_changed={(props, map, e) => {
                    console.log('zoom changed');
                    // let bounds = map.getBounds();
                    // let ne = bounds.getNorthEast();
                    // let sw = bounds.getSouthWest();
                    // console.log(`ne=(${ne.lat()}, ${ne.lng()})`);
                    // console.log(`sw=(${sw.lat()}, ${sw.lng()})`);
                    this.handleGeoSearch(map);
                    // console.log('zoom=' + map.getZoom());
                }}>

                <CustomControl onClick={() => {
                    if (this.props.onListViewClick) {
                        this.props.onListViewClick();
                    }
                }} />

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
                                    <Card.Header className='FoodCardHeader'>
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