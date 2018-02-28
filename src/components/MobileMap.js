import React from 'react'
import './MobileMap.css'
import { Map, Marker, CustomControl, Polygon } from './Map'
import Regions from './Map/Regions'

// const __GAPI_KEY__ = 'AIzaSyBrqSxDb_BPNifobak3Ho02BuZwJ05RKHM';

export default class MobileMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedRegionIds: [],
            showDeliveryInstructions: !props.pickup
        };
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

    handleMarkerClick = (props, marker, e) => {
        if (this.props.onMarkerClick) {
            this.props.onMarkerClick(props.food_id);
        }
    }

    handleRegionSearch() {
        if (this.props.onRegionSelected) {
            const selectedRegions = Regions.filter(r => this.state.selectedRegionIds.includes(r.id));
            this.props.onRegionSelected(selectedRegions);
        }
    }

    handleRegionClick = (props, map, e) => {
        const newState = {
            selectedRegionIds: [props.id],
            showDeliveryInstructions: false
        }
        this.setState(newState, () => this.handleRegionSearch());
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
                this.handleRegionSearch();
            }
        }
    }

    handleDeliveryInstructionsClick = () => {
        this.setState({ showDeliveryInstructions: false });
    }

    render() {
        const { selectedItemId, pickup, foods } = this.props;
        const { showDeliveryInstructions } = this.state;

        let polygons;
        if (!pickup) {
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
                        onClick={this.handleRegionClick}
                    />);
            })
        }

        const markers = foods.map(foodItem => {
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
                    onClick={this.handleMarkerClick}
                />
            );
        });

        const style1 = {
            color: 'rgb(25,25,25)',
            fontSize: '16px',
            lineHeight: '24px',
            paddingLeft: '5px',
            paddingRight: '5px',
            display: 'flex'
        };

        const styleBase = {
            backgroundColor: '#fff',
            border: '2px solid #fff',
            paddingLeft: '15px',
            paddingRight: '15px',
            paddingTop: '3px',
            paddingBottom: '3px',
            boxShadow: '0 2px 6px rgba(0,0,0,.3)',
            cursor: 'pointer',
            marginBottom: '22px',
            textAlign: 'center',
        };

        const styleListView = Object.assign({
            borderTopLeftRadius: '12px',
            borderBottomLeftRadius: '12px',
        }, styleBase);

        const styleFilter = Object.assign({
            borderTopRightRadius: '12px',
            borderBottomRightRadius: '12px',
        }, styleBase);

        const infoStyle = {
            marginTop: '10px',
            marginLeft: '20px',
            backgroundColor: '#fff',
            lineHeight: '38px',
            paddingLeft: '5px',
            paddingRight: '5px',
            color: 'rgb(25,25,25)',
            fontSize: '16px',
            border: '2px solid #fff',
            borderRadius: '3px',
            boxShadow: '0 2px 6px rgba(0,0,0,.3)',
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
                onDragend={this.handleGeoSearch}
                onZoom_changed={this.handleGetSearch}
                onMapCreated={this.props.onMapCreated}>

                <CustomControl position={window.google.maps.ControlPosition.BOTTOM}>
                    <div style={style1}>
                        <div style={styleListView} onClick={this.props.onListViewClick}>List</div>
                        <div style={styleFilter} onClick={this.props.onFilterClick}>Filter</div>
                    </div>
                </CustomControl>

                <CustomControl visible={showDeliveryInstructions} position={window.google.maps.ControlPosition.TOP_CENTER}>
                    <div style={infoStyle} onClick={this.handleDeliveryInstructionsClick}>
                        Click neighbourhood to deliver to
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