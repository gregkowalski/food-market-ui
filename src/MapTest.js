//import React from 'react'
// import Footer from 'components/Footer'
// import AddTodo from 'containers/AddTodo'
// import VisibleTodoList from 'containers/VisibleTodoList'
import React, { Component } from 'react'
import './MapTest.css'
import { MapContainer } from './MapContainer'
import Food from './Food'
import Map from './Map'
import AppHeader from './components/AppHeader'
import ApiClient from './Api/ApiClient'
import { Button } from 'semantic-ui-react'
import Autocomplete from 'react-google-autocomplete';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment'

class MapTest extends Component {

    isDebug = false;

    foods;

    constructor(props) {
        super(props);

        let mapZoom = Map.defaultProps.zoom;
        if (!mapZoom) {
            mapZoom = 13;
        }

        this.state = {
            hoveredFoodItemId: -1,
            pickup: true,
            mapZoom: mapZoom,
            foods: []
        };
    }

    componentWillMount() {
        let geo = {
            ne_lat: 50,
            ne_lng: -120,
            sw_lat: 48,
            sw_lng: -125
        }
        this.geoSearchFoods(geo);
    }

    geoSearchFoods(geo) {
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
        console.log('search region: ' + region.id);
        const google = window.google;
        const polygon = new google.maps.Polygon({ paths: region.paths });
        let foods = this.foods.filter(food => {
            const point = new window.google.maps.LatLng(food.position.lat, food.position.lng);
            const contains = window.google.maps.geometry.poly.containsLocation(point, polygon);
            console.log(`point=${point} contains: ${contains}`);
            return contains;
        });
        this.setState({ foods: foods });
    }

    handleDateChange = (date) => {
        console.dir(date);
        this.setState({ date: date });
    };

    handleTimeChange = (event, data) => {
        this.setState({ time: data.value });
    };

    handleAddressChange(place) {
        console.log(place);
        this.setState({
            address: place,
            mapLocation: place.geometry.location,
            mapZoom: this.state.mapZoom
        });
    };

    handleFoodItemEnter(itemId) {
        if (this.isDebug) {
            console.log('handleFoodItemEnter id=' + itemId);
        }
        this.setState({
            hoveredFoodItemId: itemId
        });
    }

    handleFoodItemLeave(itemId) {
        if (this.isDebug) {
            console.log('handleFoodItemLeave id=' + itemId);
        }
        this.setState({
            hoveredFoodItemId: -1
        });
    }

    handleClick = () => this.setState({ pickup: !this.state.pickup })

    dateCutoff = moment().add(36, 'hours');

    isDayOutsideRange = (date) => {

        const year1 = date.year();
        const month1 = date.month();
        const day1 = date.date();

        const year2 = this.dateCutoff.year();
        const month2 = this.dateCutoff.month();
        const day2 = this.dateCutoff.date();

        //console.log(`dateCutoff=${year2}-${month2}-${day2}, date=${year1}-${month1}-${day1}`);

        if (year1 !== year2)
            return year1 < year2;

        if (month1 !== month2)
            return month1 < month2;

        return day1 < day2;
    }

    render() {
        const { pickup } = this.state;
        return (
            <div className='map-wrap'>
                <AppHeader fixed />
                <div className='map-bodywrap'>
                    <div className='map'>
                        <MapContainer foods={this.state.foods}
                            showRegions={!pickup}
                            selectedItemId={this.state.hoveredFoodItemId}
                            center={this.state.mapLocation}
                            zoom={this.state.mapZoom}
                            onGeoSearch={(geo) => this.geoSearchFoods(geo)}
                            onRegionSelected={(region) => this.handleRegionSelected(region)} />
                    </div>
                    <div className='map-center'>
                        <Food foods={this.state.foods}
                            onFoodItemEnter={(itemId) => this.handleFoodItemEnter(itemId)}
                            onFoodItemLeave={(itemId) => this.handleFoodItemLeave(itemId)}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default MapTest;