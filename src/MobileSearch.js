import React, { Component } from 'react'
import './MobileSearch.css'
import MobileMap from './MobileMap'
import Food from './Food'
import Map from './Map'
import ApiClient from './Api/ApiClient'
import { Dimmer, Icon } from 'semantic-ui-react'
import FoodCarousel from './FoodCarousel';
import Util from './Util'
import { makeCancelable } from './Map/lib/cancelablePromise'
import AppHeader from './components/AppHeader'
import FoodFilter from './components/FoodFilter'
import SearchFilter from './components/SearchFilter'
import FilterBar from './components/FilterBar'

class MapSearch extends Component {

    foods;

    constructor(props) {
        super(props);

        let mapZoom = Map.defaultProps.zoom;
        if (!mapZoom) {
            mapZoom = 13;
        }

        this.state = {
            mapZoom: mapZoom,
            foods: [],
            pickup: true,
            mapSearch: false,
            showFilter: false
        };
    }

    showMapSearch = () => {
        this.setState({ mapSearch: true });
    }

    showListView = () => {
        if (this.state.mapSearch) {
            // The resize event on the window is used as a workaround for a defect with nuka carousel
            // on the Food.js page where the images don't render.  This happens because we show/hide
            // the list view vs. map search using CSS display: none instead of rendering vs. non-rendering
            // using React.  That's done because it's faster to switch views than to re-render the DOM.
            this.setState({ mapSearch: false }, () => Util.triggerEvent(window, 'resize'));
        }
    }

    componentDidMount() {
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

    handleGeoSearch = (map) => {
        const geo = Util.getGeoBounds(map);
        this.geoSearchFoods(geo);
    }

    geoSearchFoods(geo) {
        if (!this.state.pickup) {
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

    handleRegionSelected(regions) {
        const google = window.google;
        const polygons = regions.map(region => {
            console.log('search region: ' + region.id);
            return new google.maps.Polygon({ paths: region.paths });
        })
        let foods = this.foods.filter(food => {
            const point = new google.maps.LatLng(food.position.lat, food.position.lng);
            let contains = false;
            polygons.forEach(polygon => {
                if (contains)
                    return;

                contains = google.maps.geometry.poly.containsLocation(point, polygon);
            })
            console.log(`point=${point} contains: ${contains}`);
            return contains;
        });
        const newState = { foods };
        if (foods && foods.length > 0) {
            newState.selectedFoodId = foods[0].food_id;
        }
        this.setState(newState);
    }

    handleMapCreated = (map) => this.map = map;

    handleDateFilterClick = () => {
        this.setState({ dimmed: !this.state.dimmed });
    }

    handleDateFilterClose = () => {
        this.handleDateFilterClick();
    }

    handleDateFilterClear = () => {
        this.handleDateFilterClick();
    }

    handleDateFilterApply = (date) => {
        this.handleDateFilterClick();
    }

    hideDimmer = () => {
        if (this.state.dimmed) {
            this.setState({ dimmed: false });
        }
    }

    handlePickupClick = () => {
        if (this.state.pickup)
            return;

        this.setState({ pickup: true }, () => {
            const geo = Util.getGeoBounds(this.map);
            this.geoSearchFoods(geo);
        });
    }

    handleDeliveryClick = () => {
        if (!this.state.pickup)
            return;

        this.setState({ pickup: false });
    }

    showFilter = () => {
        this.setState({ showFilter: true });
    }

    hideFilter = () => {
        this.setState({ showFilter: false });
    }

    getFilterStyle() {
        if (this.state.showFilter) {
            return {
                height: '100%',
                top: 0
            };
        }
        return {
            height: 0,
            top: '100%'
        };
    }

    mapHeight = '62vh';
    filterBarHeight = '50px';

    getMapStyle(mapSearch) {
        let mapStyle = {
            height: mapSearch ? `calc(${this.mapHeight} - ${this.filterBarHeight})` : '500px',
            minHeight: mapSearch ? `calc(${this.mapHeight} - ${this.filterBarHeight})` : '500px',
            marginTop: `${this.filterBarHeight}`,
            width: '100%',
            touchAction: 'none',
            borderBottom: '1px solid #DBDBDB',
            borderTop: '1px solid #DBDBDB',
        };

        if (mapSearch) {
            mapStyle.position = 'fixed';
        }
        else {
            mapStyle.display = 'none';
        }
        return mapStyle;
    }

    getFoodCarouselStyle(mapSearch) {
        const style = {
            paddingTop: `calc(${this.mapHeight} + 5px)`,
            marginLeft: '10px'
        };
        if (!mapSearch) {
            style.display = 'none';
        }
        return style;
    }

    getDimmerStyle() {
        return {
            position: 'fixed',
            marginTop: `${this.filterBarHeight}`
        };
    }

    getListViewStyle(mapSearch) {
        const style = {};
        if (mapSearch) {
            style.display = 'none';
        }
        return style;
    }

    handleSearchFilterChange = (filter) => {
        this.setState({ filter });
    }

    render() {
        let { pickup, mapSearch, dimmed, showFilter, filter } = this.state;

        if (mapSearch) {
            this.mapSearchHasBeenVisible = true;
        }

        return (
            <div className='mobilesearch-wrap' onClick={this.hideDimmer}>
                {!mapSearch &&
                    <AppHeader fixed noshadow />
                }

                {!mapSearch &&
                    <FilterBar style={{ top: '55px', position: 'fixed' }} filter={filter} onFilterClick={this.showFilter} />
                }

                <div className='mobilesearch-filter' style={this.getFilterStyle(showFilter)}>
                    <SearchFilter visible={showFilter} onFilterHide={this.hideFilter} onFilterChange={this.handleSearchFilterChange} />
                </div>

                <div className='mobilesearch-bodywrap'>
                    <Dimmer.Dimmable dimmed={dimmed}>

                        <Dimmer active={dimmed} inverted onClickOutside={this.hideDimmer} style={this.getDimmerStyle()} />

                        {mapSearch &&
                            <FoodFilter style={{ top: '0px', position: 'fixed' }} showDateFilter={dimmed} pickup={pickup} mobile={true}
                                onDateFilterClick={this.handleDateFilterClick}
                                onDateFilterClose={this.handleDateFilterClose}
                                onDateFilterClear={this.handleDateFilterClear}
                                onDateFilterApply={this.handleDateFilterApply}
                                onPickupClick={this.handlePickupClick}
                                onDeliveryClick={this.handleDeliveryClick} />
                        }

                        {this.mapSearchHasBeenVisible &&
                            <div style={this.getMapStyle(mapSearch)}>
                                <MobileMap foods={this.state.foods}
                                    pickup={pickup}
                                    center={this.state.mapLocation}
                                    selectedItemId={this.state.selectedFoodId}
                                    zoom={this.state.mapZoom}
                                    gestureHandling='greedy'
                                    visible={mapSearch}
                                    onGeoSearch={this.handleGeoSearch}
                                    onRegionSelected={(regions) => this.handleRegionSelected(regions)}
                                    onListViewClick={this.showListView}
                                    onFilterClick={this.showFilter}
                                    onMarkerClick={(selectedItemId) => this.setState({ selectedFoodId: selectedItemId })}
                                    onMapCreated={this.handleMapCreated}
                                />
                            </div>
                        }
                        <div className='mobilesearch-foodcarousel' style={this.getFoodCarouselStyle(mapSearch)}>
                            <FoodCarousel foods={this.state.foods} selectedFoodId={this.state.selectedFoodId}
                                onSelected={(selectedFood) => {
                                    this.setState({
                                        mapLocation: selectedFood.position,
                                        selectedFoodId: selectedFood.food_id
                                    });
                                }} />
                        </div>

                        <div className='mobilesearch-foodgrid' style={this.getListViewStyle(mapSearch)}>
                            <Food foods={this.state.foods} />
                            <Icon className='mobilesearch-foodgrid-icon' name='marker' color='teal' size='big' onClick={this.showMapSearch} />
                        </div>

                    </Dimmer.Dimmable>
                </div>
            </div >
        )
    }
}

export default MapSearch;