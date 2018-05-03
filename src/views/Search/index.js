import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Actions, Selectors } from '../../store/search'
import Util from '../../services/Util'
import DesktopSearch from './Desktop/DesktopSearch'
import MobileSearch from './Mobile/MobileSearch'

class SearchContainer extends React.Component {

    handlePickupClick = () => {
        this.props.actions.selectPickup();
    }

    handleDeliveryClick = () => {
        this.props.actions.selectDelivery();
    }

    handleGeoLocationChanged = (geo) => {
        if (!Util.isEqualGeo(this.props.geo, geo)) {
            this.props.actions.geoLocationChanged(geo);
        }
    }

    handleDateChanged = (date) => {
        if (this.props.date !== date) {
            this.props.actions.dateChanged(date);
        }
    }

    handleRegionSelected = (region) => {
        if (!Util.isEqualRegion(this.props.region, region)) {
            this.props.actions.regionChanged(region);
        }
    }

    componentWillMount() {
        const query = Util.parseQueryString(this.props.location);
        this.isMobile = query.mobile || query.m || Util.isMobile();

        const { pickup, region, actions } = this.props;
        actions.clearFoods();
        if (!pickup && region) {
            actions.requestFoodsInRegion(region);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { pickup, geo, region, actions } = this.props;

        if (pickup !== nextProps.pickup) {
            if (nextProps.pickup && geo) {
                actions.requestFoods(geo);
            }
            else if (region) {
                actions.requestFoodsInRegion(region);
            }
        }
        else if (geo !== nextProps.geo && pickup) {
            actions.requestFoods(nextProps.geo);
        }
        else if (region !== nextProps.region && !pickup) {
            actions.requestFoodsInRegion(nextProps.region);
        }
    }

    render() {
        const { pickup, isLoading, foods, region, date, geo, mapCenter } = this.props;

        const searchProps = {
            pickup, isLoading, foods, region, date, geo, mapCenter,
            onGeoLocationChanged: this.handleGeoLocationChanged,
            onRegionSelected: this.handleRegionSelected,
            onDateChanged: this.handleDateChanged,
            onPickupClick: this.handlePickupClick,
            onDeliveryClick: this.handleDeliveryClick
        }

        if (this.position) {
            searchProps.initialMapCenter = this.position;
        }

        return this.isMobile ? <MobileSearch {...searchProps} /> : <DesktopSearch {...searchProps} />;
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
        mapCenter: Selectors.mapCenter(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};

SearchContainer.propTypes = {
    foods: PropTypes.arrayOf(PropTypes.shape({
        food_id: PropTypes.string.isRequired,
    })),
    geo: PropTypes.object,
    region: PropTypes.object,
    date: PropTypes.object,
    isLoading: PropTypes.bool,
    pickup: PropTypes.bool.isRequired,

    actions: PropTypes.shape({
        selectPickup: PropTypes.func.isRequired,
        selectDelivery: PropTypes.func.isRequired,
        requestFoods: PropTypes.func.isRequired,
        requestFoodsInRegion: PropTypes.func.isRequired,
        geoLocationChanged: PropTypes.func.isRequired,
        regionChanged: PropTypes.func.isRequired,
        dateChanged: PropTypes.func.isRequired
    }).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);