import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Actions, Selectors } from '../../../store/search'
import { Dimmer } from 'semantic-ui-react'
import './DesktopSearch.css'
import withGoogle from '../../../hoc/WithGoogleHoc'
import Util from '../../../services/Util'
import LoadingIcon from '../../../components/LoadingIcon'
import AppHeader from '../../../components/AppHeader'
import RegionUtil from '../../../components/Map/RegionUtil'
import FoodGrid from '../FoodGrid'
import FoodFilter from './FoodFilter'
import DesktopMap from './DesktopMap'

class DesktopSearch extends React.Component {

    state = { dimmed: false };

    handleFoodItemEnter = (itemId) => {
        this.setState({ hoveredFoodId: itemId });
    }

    handleFoodItemLeave = (itemId) => {
        this.setState({ hoveredFoodId: undefined });
    }

    hideDimmer = () => {
        if (this.state.dimmed) {
            this.setState({ dimmed: false });
        }
    }

    showDimmer = (show) => {
        this.setState({ dimmed: show });
    }

    handleGeoLocationChanged = (newGeo) => {
        const { actions, pickup, geo } = this.props;
        if (!Util.isEqualGeo(geo, newGeo)) {
            actions.geoLocationChanged(newGeo);
            if (pickup) {
                actions.requestFoods(newGeo);
            }
        }
    }

    componentWillMount() {
        const { actions, pickup, region } = this.props;
        if (!pickup) {
            actions.requestFoodsInRegion(region);
        }
    }

    handleDeliveryOptionChanged = (pickup) => {
        const { actions, geo, region } = this.props;
        if (pickup) {
            actions.selectPickup();
            actions.requestFoods(geo);
        }
        else {
            actions.selectDelivery();
            actions.requestFoodsInRegion(region);
        }
    }

    handleDateChanged = (date) => {
        const { actions, pickup, geo, region } = this.props;

        actions.dateChanged(date);
        if (pickup) {
            actions.requestFoods(geo);
        }
        else {
            actions.requestFoodsInRegion(region);
        }
    }

    handleDeliveryAddressSelected = (place) => {
        if (place && place.geometry) {
            const { actions, google } = this.props;
            const selectedLocation = Util.toLocation(google, place.geometry.location);
            const region = RegionUtil.getRegionByPosition(google, selectedLocation);
            actions.regionChanged(region);
            actions.mapCenterChanged(selectedLocation);
            actions.addressChanged(Util.toAddress(google, place));
            actions.requestFoodsInRegion(region);
        }
    }

    render() {
        const { pickup, isLoading, foods, date, address, mapCenter, google } = this.props;
        const { dimmed, hoveredFoodId } = this.state;

        return (
            <div className='dtsearch-wrap' onClick={this.hideDimmer}>
                <AppHeader fixed noshadow />
                <div className='dtsearch-foodfilter'>
                    <FoodFilter
                        pickup={pickup}
                        date={date}
                        address={address}
                        show={dimmed}
                        onShowFilter={this.showDimmer}
                        onHideFilter={this.hideDimmer}
                        onDeliveryOptionChanged={this.handleDeliveryOptionChanged}
                        onDeliveryAddressSelected={this.handleDeliveryAddressSelected}
                        onDateChanged={this.handleDateChanged}
                    />
                </div>
                <div className='dtsearch-bodywrap'>
                    <Dimmer.Dimmable dimmed={dimmed}>
                        <Dimmer active={dimmed} inverted onClickOutside={this.hideDimmer}
                            style={{ position: 'fixed', marginTop: '105px' }} />
                        <div className='dtsearch-center'>
                            {!isLoading &&
                                <FoodGrid foods={foods}
                                    onFoodItemEnter={this.handleFoodItemEnter}
                                    onFoodItemLeave={this.handleFoodItemLeave} />
                            }
                            {isLoading &&
                                <div className='dtsearch-loading-icon'>
                                    <LoadingIcon size='big' />
                                </div>
                            }
                        </div>
                        <div className='dtsearch-right'>
                            {google &&
                                <DesktopMap
                                    google={google}
                                    foods={foods}
                                    pickup={pickup}
                                    center={mapCenter}
                                    initialCenter={mapCenter}
                                    selectedLocation={mapCenter}
                                    hoveredFoodId={hoveredFoodId}
                                    onGeoLocationChanged={this.handleGeoLocationChanged}
                                />
                            }
                        </div>
                    </Dimmer.Dimmable>
                </div>
            </div >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        pickup: Selectors.pickup(state),
        isLoading: Selectors.isLoading(state),
        foods: Selectors.foods(state),
        geo: Selectors.geoLocation(state),
        region: Selectors.region(state),
        date: Selectors.date(state),
        mapCenter: Selectors.mapCenter(state),
        address: Selectors.address(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};

DesktopSearch.propTypes = {
    foods: PropTypes.arrayOf(PropTypes.shape({
        food_id: PropTypes.string.isRequired,
    })),
    geo: PropTypes.object,
    region: PropTypes.object,
    date: PropTypes.object,
    isLoading: PropTypes.bool,
    pickup: PropTypes.bool.isRequired,
    address: PropTypes.object,

    actions: PropTypes.shape({
        requestFoods: PropTypes.func.isRequired,
        requestFoodsInRegion: PropTypes.func.isRequired,
        geoLocationChanged: PropTypes.func.isRequired,
        regionChanged: PropTypes.func.isRequired,
        mapCenterChanged: PropTypes.func.isRequired,
        addressChanged: PropTypes.func.isRequired,
        selectPickup: PropTypes.func.isRequired,
        selectDelivery: PropTypes.func.isRequired,
        dateChanged: PropTypes.func.isRequired,
    }).isRequired
}

export default withGoogle(connect(mapStateToProps, mapDispatchToProps)(DesktopSearch));
