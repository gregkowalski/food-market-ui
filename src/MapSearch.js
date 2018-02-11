//import React from 'react'
// import Footer from 'components/Footer'
// import AddTodo from 'containers/AddTodo'
// import VisibleTodoList from 'containers/VisibleTodoList'
import React, { Component } from 'react'
import './MapSearch.css'
import { MobileMap } from './MobileMap'
import Food from './Food'
import Map from './Map'
import AppHeader from './components/AppHeader'
import ApiClient from './Api/ApiClient'
import { Button } from 'semantic-ui-react'
import Autocomplete from 'react-google-autocomplete';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment'
import FoodCarousel from './FoodCarousel';
import Util from './Util'
import { makeCancelable } from './Map/lib/cancelablePromise'

class MapSearch extends Component {

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
            foods: [],
            fullMap: false,
            showFilter: false
        };
    }

    componentDidMount() {
        if (navigator && navigator.geolocation) {
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
    }

    geoSearchFoods(geo) {
        console.log('geosearch');
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

    handleGetCurrentLocation = (props, map, loc) => {
        const bound = Util.convertMetersToDegrees(2500);
        let geo = {
            ne_lat: loc.lat + bound,
            ne_lng: loc.lng + bound,
            sw_lat: loc.lat - bound,
            sw_lng: loc.lng - bound
        }
        // this.geoSearchFoods(geo);
    }

    handleRegionSelected(regions) {
        const google = window.google;
        const polygons = regions.map(region => {
            console.log('search region: ' + region.id);
            return new google.maps.Polygon({ paths: region.paths });
        })
        let foods = this.foods.filter(food => {
            const point = new window.google.maps.LatLng(food.position.lat, food.position.lng);
            let contains = false;
            polygons.forEach(polygon => {
                if (contains)
                    return;

                contains = window.google.maps.geometry.poly.containsLocation(point, polygon);
            })
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
        let { pickup, fullMap, showFilter } = this.state;
        const mapHeight = '62vh';

        let mapStyle = {
            height: fullMap ? (showFilter ? `calc(${mapHeight} - 90px)` : `${mapHeight}`) : '500px',
            minHeight: fullMap ? (showFilter ? `calc(${mapHeight} - 90px)` : `${mapHeight}`) : '500px',
            width: '100%',
            marginTop: showFilter ? '90px' : '0px',
        };
        if (fullMap) {
            mapStyle.position = 'fixed';
            this.hasBeenVisible = true;
        }
        else {
            mapStyle.display = 'none';
        }

        return (
            <div className='map3-wrap'>
                {!fullMap &&
                    <AppHeader fixed />
                }
                <div className='map3-bodywrap'>
                    {fullMap &&
                        <div className='mapsearch-filter' style={{ display: showFilter ? 'inherit' : 'none' }}>
                            <Autocomplete className='app-address' style={{ display: pickup ? 'none' : 'inherit' }}
                                name='address'
                                onPlaceSelected={(place) => this.handleAddressChange(place)}
                                types={['address']}
                                placeholder='Address'
                                componentRestrictions={{ country: 'ca' }} />

                            <div>
                                <SingleDatePicker
                                    date={this.state.date} // momentPropTypes.momentObj or null
                                    isOutsideRange={this.isDayOutsideRange}
                                    onDateChange={this.handleDateChange}
                                    focused={this.state.focused} // PropTypes.bool
                                    onFocusChange={({ focused }) => {
                                        this.setState({ focused });
                                        // if (!focused) {
                                        //     this.handleContactInfoBlur({ target: { name: 'date' } });
                                        // }
                                    }} // PropTypes.func.isRequired
                                    numberOfMonths={1}
                                    placeholder="Date"
                                    displayFormat={() =>
                                        //moment.localeData().longDateFormat('LL')
                                        'MMMM DD, YYYY'
                                    }
                                />
                            </div>
                        </div>
                    }

                    {this.hasBeenVisible &&
                        <div style={mapStyle}>
                            <MobileMap foods={this.state.foods}
                                showRegions={!pickup}
                                selectedItemId={this.state.hoveredFoodItemId}
                                center={this.state.mapLocation}
                                zoom={this.state.mapZoom}
                                gestureHandling='auto'
                                visible={fullMap}
                                onGeoSearch={(geo) => this.geoSearchFoods(geo)}
                                onRegionSelected={(regions) => this.handleRegionSelected(regions)}
                                onListViewClick={() => this.setState({ fullMap: false })}
                                onFilterClick={() => this.setState({ showFilter: !this.state.showFilter })}
                                onGetCurrentLocation={this.handleGetCurrentLocation}
                                onMarkerClick={(selectedItemId) => this.setState({ selectedFoodId: selectedItemId })}
                            />
                        </div>
                    }
                    {fullMap && this.state.foods && this.state.foods.length > 0 &&
                        <div className='map3-food-carousel' style={{ paddingTop: `calc(${mapHeight} + 5px)`, marginLeft: '10px' }}>
                            {/* <div className='map3-food-carousel'> */}
                            {/* <div style={{ height: '50%', backgroundColor: 'rgba(0,0,0,0)' }}>
                            </div> */}
                            <FoodCarousel foods={this.state.foods} selectedFoodId={this.state.selectedFoodId}
                                // onFoodItemEnter={(itemId) => this.handleFoodItemEnter(itemId)}
                                // onFoodItemLeave={(itemId) => this.handleFoodItemLeave(itemId)}
                                onSelected={(selectedFood) => {
                                    this.handleFoodItemEnter(selectedFood.food_id);
                                    this.setState({ mapLocation: selectedFood.position });
                                }} />
                        </div>
                    }

                    {!fullMap &&
                        <div className='map3-center'>
                            <Food foods={this.state.foods}
                                onFoodItemEnter={(itemId) => this.handleFoodItemEnter(itemId)}
                                onFoodItemLeave={(itemId) => this.handleFoodItemLeave(itemId)}
                            />
                            <Button style={{ position: 'fixed', bottom: '10px', right: '20px' }} onClick={() => this.setState({ fullMap: true })}>Map Search</Button>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default MapSearch;