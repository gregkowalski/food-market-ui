import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Dimmer, Icon } from 'semantic-ui-react'
import './MobileSearch.css'
import MobileMap from '../components/MobileMap'
import FoodGrid from '../components/FoodGrid'
import FoodCarousel from '../components/FoodCarousel';
import Util from '../services/Util'
import Url from '../services/Url'
import AppHeader from '../components/AppHeader'
import DeliveryOptionFilter from '../components/DeliveryOptionFilter'
import SearchFilter from '../components/SearchFilter'
import FilterBar from '../components/FilterBar'
import Drawer from '../components/Drawer'

class MobileSearch extends Component {

    constructor(props) {
        super(props);

        this.mapHeight = '63vh';
        this.filterBarHeight = '8vh';
        this.state = {
            mapSearch: this.isMapSearch(this.props.location),
            showFilter: false,
            dimmed: false
        };
    }

    isMapSearch(location) {
        const query = Util.parseQueryString(location);
        if (query.view && query.view === 'map') {
            return true;
        }
        return false;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location !== nextProps.location) {
            // The resize event on the window is used as a workaround for a defect with nuka carousel
            // on the Food.js page where the images don't render.  This happens because we show/hide
            // the list view vs. map search using CSS display: none instead of rendering vs. non-rendering
            // using React.  That's done because it's faster to switch views than to re-render the DOM.
            this.setState({ mapSearch: this.isMapSearch(nextProps.location) }, () => Util.triggerEvent(window, 'resize'));
        }

        if (this.props.foods !== nextProps.foods) {
            const { foods } = nextProps;
            if (foods && foods.length > 0) {
                this.setState({ selectedFoodId: foods[0].food_id });
            }
        }
    }

    componentDidMount() {
        if (!this.state.selectedFoodId) {
            const { foods } = this.props;
            if (foods && foods.length > 0) {
                this.setState({ selectedFoodId: foods[0].food_id });
            }
        }
    }

    handleDateFilterClear = () => {
        this.props.onDateChanged(null);
        this.hideDimmer();
    }

    handleDateFilterApply = (date) => {
        this.props.onDateChanged(date);
        this.hideDimmer();
    }

    handleDateFilterClick = () => this.setState({ dimmed: !this.state.dimmed });
    handleDateFilterClose = () => this.hideDimmer();

    hideDimmer = () => this.setState({ dimmed: false });
    showFilter = () => this.setState({ showFilter: true });
    hideFilter = () => this.setState({ showFilter: false });
    showMapSearch = () => this.props.history.push(Url.home() + '?m=1&view=map');
    showListView = () => this.props.history.push(Url.home() + '?m=1&view=list');
    handleSearchFilterChange = (filter) => this.setState({ filter });
    handleMarkerClick = (selectedFoodId) => this.setState({ mapSelectedFoodId: selectedFoodId });
    handleSelectedFood = (selectedFood) => {
        setTimeout(() => {
            this.setState({
                mapLocation: selectedFood.position,
                selectedFoodId: selectedFood.food_id
            });
        }, 200);
    }

    handleFilterBarDeliveryClick = () => {
        this.props.onDeliveryClick();
        this.showMapSearch();
    }

    getFilterStyle(showFilter) {
        if (showFilter) {
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

    getMapStyle(mapSearch) {
        let mapStyle = {
            height: `calc(${this.mapHeight} - ${this.filterBarHeight})`,
            minHeight: `calc(${this.mapHeight} - ${this.filterBarHeight})`,
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

    deliveryOptionFilterStyle() {
        return {
            top: '0px',
            position: 'fixed',
            height: this.filterBarHeight
        };
    }

    getFilterBarStyle() {
        return {
            top: '55px',
            position: 'fixed'
        }
    }

    getDimmerStyle() {
        return {
            position: 'fixed',
            marginTop: `${this.filterBarHeight}`,
        };
    }

    getListViewStyle(mapSearch) {
        const style = {};
        if (mapSearch) {
            style.display = 'none';
        }
        return style;
    }

    render() {
        let { mapSearch, dimmed, showFilter, filter, selectedFoodId, mapSelectedFoodId, mapLocation } = this.state;
        let { pickup, foods, region, date } = this.props;

        return (
            <div className='mobilesearch-wrap' onClick={this.hideDimmer}>

                {!mapSearch &&
                    <AppHeader fixed noshadow />
                }

                {!mapSearch &&
                    <FilterBar style={this.getFilterBarStyle()} filter={filter} pickup={pickup}
                        onFilterClick={this.showFilter}
                        onPickupClick={this.props.onPickupClick}
                        onDeliveryClick={this.handleFilterBarDeliveryClick} />
                }

                <Drawer visible={showFilter}>
                    <SearchFilter visible={showFilter} onFilterHide={this.hideFilter} onFilterChange={this.handleSearchFilterChange} />
                </Drawer>

                <div className='mobilesearch-bodywrap'>
                    <Dimmer.Dimmable dimmed={dimmed}>

                        <Dimmer style={this.getDimmerStyle()} active={dimmed} inverted onClickOutside={this.hideDimmer} />

                        <DeliveryOptionFilter style={this.deliveryOptionFilterStyle()}
                            mobile={true}
                            showDateFilter={dimmed}
                            pickup={pickup}
                            date={date}
                            onDateFilterClick={this.handleDateFilterClick}
                            onDateFilterClose={this.handleDateFilterClose}
                            onDateFilterClear={this.handleDateFilterClear}
                            onDateFilterApply={this.handleDateFilterApply}
                            onPickupClick={this.props.onPickupClick}
                            onDeliveryClick={this.props.onDeliveryClick}
                        />

                        <div style={this.getMapStyle(mapSearch)}>
                            <MobileMap foods={foods}
                                pickup={pickup}
                                center={mapLocation}
                                selectedRegion={region}
                                selectedFoodId={selectedFoodId}
                                gestureHandling='greedy'
                                visible={mapSearch}
                                onGeoLocationChanged={this.props.onGeoLocationChanged}
                                onRegionSelected={this.props.onRegionSelected}
                                onListViewClick={this.showListView}
                                onFilterClick={this.showFilter}
                                onMarkerClick={this.handleMarkerClick}
                            />
                        </div>
                        <div className='mobilesearch-foodcarousel' style={this.getFoodCarouselStyle(mapSearch)}>
                            <FoodCarousel
                                foods={foods}
                                pickup={pickup}
                                date={date}
                                selectedFoodId={selectedFoodId}
                                mapSelectedFoodId={mapSelectedFoodId}
                                onSelected={this.handleSelectedFood}
                            />
                        </div>

                        <div className='mobilesearch-foodgrid' style={this.getListViewStyle(mapSearch)}>
                            <FoodGrid foods={foods} />
                            <Icon className='mobilesearch-foodgrid-icon' name='marker' color='purple' onClick={this.showMapSearch} />
                        </div>

                    </Dimmer.Dimmable>
                </div>
            </div >
        )
    }
}

export default withRouter(MobileSearch);