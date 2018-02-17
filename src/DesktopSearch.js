//import React from 'react'
// import Footer from 'components/Footer'
// import AddTodo from 'containers/AddTodo'
// import VisibleTodoList from 'containers/VisibleTodoList'
import React, { Component } from 'react'
import './DesktopSearch.css'
import { DesktopMap } from './DesktopMap'
import Food from './Food'
import Map from './Map'
import AppHeader from './components/AppHeader'
import FoodFilter from './components/FoodFilter'
import ApiClient from './Api/ApiClient'
import { Dimmer } from 'semantic-ui-react'
import Util from './Util'
import { makeCancelable } from './Map/lib/cancelablePromise'

export default class DesktopSearch extends Component {

    foods;

    constructor(props) {
        super(props);

        let mapZoom = Map.defaultProps.zoom;
        if (!mapZoom) {
            mapZoom = 13;
        }

        this.state = {
            hoveredFoodItemId: -1,
            mapZoom: mapZoom,
            foods: [],
            pickup: true,
            dimmed: false
        };
    }

    componentWillMount() {
        this.geoSearchNearCurrentLocation();
    }

    geoSearchNearCurrentLocation() {
        if (!navigator || !navigator.geolocation) {
            return;
        }
        this.geoPromise = makeCancelable(
            new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            })
        );

        this.geoPromise.promise
            .then(pos => {
                const loc = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                };
                const bound = Util.convertMetersToDegrees(2500);
                let geo = {
                    ne_lat: loc.lat + bound,
                    ne_lng: loc.lng + bound,
                    sw_lat: loc.lat - bound,
                    sw_lng: loc.lng - bound
                }
                this.geoSearchFoods(geo);
            })
            .catch(e => console.error(e));
    }

    geoSearchFoods(geo) {
        if (!this.state.pickup) {
            return;
        }

        if (!geo) {
            this.geoSearchNearCurrentLocation();
            return;
        }

        let api = new ApiClient();
        api.geoSearchFoods(geo)
            .then(response => {
                let newState = {
                    foods: response.data
                };
                newState.foods.forEach(f => {
                    f.id = f.food_id;
                    f.images = f.imageUrls;
                    f.image = f.imageUrls[0];
                    f.header = f.title;
                    f.meta = f.short_description;
                    f.description = f.long_desciption;
                    f.rating = 5;
                    f.ratingCount = 3;
                    //console.log(`food_id=${f.food_id}, pos.lat=${f.position.lat}, pos.lng=${f.position.lng}`);
                });
                this.setState(newState);
                this.foods = newState.foods;
            })
            .catch(err => {
                console.error(err);
            });
    }

    handleRegionSelected(region) {
        const google = window.google;
        let foods = [];
        if (region) {
            console.log('search region: ' + region.id);
            const polygon = new google.maps.Polygon({ paths: region.paths });
            foods = this.foods.filter(food => {
                const point = new window.google.maps.LatLng(food.position.lat, food.position.lng);
                const contains = window.google.maps.geometry.poly.containsLocation(point, polygon);
                console.log(`point=${point} contains: ${contains}`);
                return contains;
            });
        }
        this.setState({ foods: foods });
    }

    handleFoodItemEnter(itemId) {
        this.setState({ hoveredFoodItemId: itemId });
    }

    handleFoodItemLeave(itemId) {
        this.setState({ hoveredFoodItemId: -1 });
    }

    handleFilterClick = () => {
        this.setState({ dimmed: !this.state.dimmed });
    }

    handleHide = () => {
        if (this.state.dimmed) {
            this.setState({ dimmed: false });
        }
    }

    handlePickupClick = () => {
        const isPickup = !this.state.pickup;
        this.setState({ pickup: isPickup });
        if (!isPickup) {
            this.handleRegionSelected();
        }
        else {
            this.geoSearchFoods();
        }
    }

    render() {
        const { pickup, dimmed } = this.state;

        return (
            <div className='dtsearch-wrap' onClick={this.handleHide}>
                <AppHeader fixed noshadow />
                <FoodFilter style={{ top: '55px', position: 'fixed' }} showFilter={dimmed} pickup={pickup}
                    onFilterClick={this.handleFilterClick} onPickupClick={this.handlePickupClick} />
                <div className='dtsearch-bodywrap' >
                    <Dimmer.Dimmable dimmed={dimmed}>
                        <Dimmer active={dimmed} inverted onClickOutside={this.handleHide}
                            style={{ position: 'fixed', marginTop: '110px' }} />
                        <div className='dtsearch-center'>
                            <Food foods={this.state.foods}
                                onFoodItemEnter={(itemId) => this.handleFoodItemEnter(itemId)}
                                onFoodItemLeave={(itemId) => this.handleFoodItemLeave(itemId)} />
                        </div>
                        <div className='dtsearch-right'>
                            <DesktopMap foods={this.state.foods}
                                showRegions={!pickup}
                                selectedItemId={this.state.hoveredFoodItemId}
                                center={this.state.mapLocation}
                                zoom={this.state.mapZoom}
                                onGeoSearch={(geo) => this.geoSearchFoods(geo)}
                                onRegionSelected={(region) => this.handleRegionSelected(region)}
                            />
                        </div>
                    </Dimmer.Dimmable>
                </div>
            </div >
        )
    }
}
