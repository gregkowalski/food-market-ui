import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Icon, Button } from 'semantic-ui-react'
import './MobileSearch.css'
import Util from '../../services/Util'
import Url from '../../services/Url'
import AppHeader from '../../components/AppHeader'
import Drawer from '../../components/Drawer'
import MobileMap from './MobileMap'
import FoodGrid from './FoodGrid'
import FoodCarousel from './FoodCarousel';
import SearchFilter from './SearchFilter'
import FilterBar from './FilterBar'

class MobileSearch extends Component {

    constructor(props) {
        super(props);

        this.mapHeight = '55vh';
        this.deliveryOptionHeight = '50px';
        this.state = {
            mapSearch: this.isMapSearch(this.props.location),
            showFilter: false,
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
            const { selectedFoodId } = this.state;
            if (foods && foods.length > 0) {
                if (!foods.some(food => food.food_id === selectedFoodId)) {
                    this.setState({ selectedFoodId: foods[0].food_id });
                }
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

    showFilter = () => this.setState({ showFilter: true });
    hideFilter = () => this.setState({ showFilter: false });
    showMapSearch = () => this.props.history.push(Url.search() + '?m=1&view=map');
    showListView = () => this.props.history.push(Url.search() + '?m=1&view=list');
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

    selectDeliveryFromFilterBar = () => {
        this.props.onDeliveryClick();
        this.showMapSearch();
    }

    selectPickup = () => {
        this.props.onPickupClick();
    }

    selectDelivery = () => {
        this.props.onDeliveryClick();
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

    deliveryOptionFilterStyle() {
        return { height: this.deliveryOptionHeight };
    }

    deliveryOptionButtonProps(active) {
        const style = { height: this.deliveryOptionHeight };
        const props = { color: 'purple', style };

        if (!active) {
            props.basic = true;
        }
        return props;
    }

    mapStyle() {
        const mapStyle = {
            height: this.mapHeight,
            top: this.deliveryOptionHeight
        };
        return mapStyle;
    }

    foodCarouselStyle() {
        const style = {
            top: `calc(${this.mapHeight} + ${this.deliveryOptionHeight} + 5px)`,
            marginLeft: '10px'
        };
        return style;
    }

    visible(isVisible) {
        if (!isVisible) {
            return { display: 'none' };
        }
        return {};
    }

    render() {
        const { mapSearch, showFilter, filter, selectedFoodId, mapSelectedFoodId, mapLocation } = this.state;
        const { pickup, foods, region, date } = this.props;

        return (
            <div className='mobilesearch'>

                <div style={this.visible(!mapSearch)}>

                    <AppHeader fixed noshadow />

                    <FilterBar className='mobilesearch-filterbar'
                        filter={filter}
                        pickup={pickup}
                        onFilterClick={this.showFilter}
                        onPickupClick={this.selectedPickup}
                        onDeliveryClick={this.selectDeliveryFromFilterBar} />

                    <div className='mobilesearch-foodgrid'>
                        <FoodGrid foods={foods} />
                        <Icon name='marker' color='purple' onClick={this.showMapSearch} />
                    </div>

                </div>

                <div style={this.visible(mapSearch)}>

                    <div className='mobilesearch-deliveryoptionfilter' style={this.deliveryOptionFilterStyle()}>
                        <Button {...this.deliveryOptionButtonProps(pickup)} onClick={this.selectPickup}>PICKUP</Button>
                        <Button {...this.deliveryOptionButtonProps(!pickup)} onClick={this.selectDelivery}>DELIVER</Button>
                    </div>

                    <div className='mobilesearch-map' style={this.mapStyle()}>
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

                    <div className='mobilesearch-foodcarousel' style={this.foodCarouselStyle()}>
                        <FoodCarousel
                            foods={foods}
                            pickup={pickup}
                            date={date}
                            selectedFoodId={selectedFoodId}
                            mapSelectedFoodId={mapSelectedFoodId}
                            onSelected={this.handleSelectedFood}
                        />
                    </div>

                </div>

                <Drawer visible={showFilter}>
                    <SearchFilter visible={showFilter} onFilterHide={this.hideFilter} onFilterChange={this.handleSearchFilterChange} />
                </Drawer>

            </div >
        )
    }
}

export default withRouter(MobileSearch);