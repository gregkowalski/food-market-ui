import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Actions, Selectors } from '../../store/search'
import Util from '../../services/Util'
import DesktopSearch from './DesktopSearch'
import MobileSearch from './MobileSearch'

class SearchContainer extends React.Component {

    componentWillMount() {
        if (!this.props.geo) {
            this.props.actions.requestCurrentGeoLocation(navigator);
        }
    }

    handlePickupClick = () => this.props.actions.selectPickup();
    handleDeliveryClick = () => this.props.actions.selectDelivery();

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

    componentWillReceiveProps(nextProps) {
        if (this.props.pickup !== nextProps.pickup) {
            if (nextProps.pickup) {
                this.props.actions.requestFoods(this.props.geo);
            }
            else {
                this.props.actions.requestFoodsInRegion(this.props.geo, this.props.region);
            }
        }
        else if (this.props.geo !== nextProps.geo && this.props.pickup) {
            this.props.actions.requestFoods(nextProps.geo);
        }
        else if (this.props.region !== nextProps.region && !this.props.pickup) {
            this.props.actions.requestFoodsInRegion(this.props.geo, nextProps.region);
        }
    }

    render() {
        const { pickup, isLoading, foods, region, date, geo } = this.props;
        const query = Util.parseQueryString(this.props.location);
        const isMobile = query.mobile || query.m || Util.isMobile();

        const searchProps = {
            pickup, isLoading, foods, region, date, geo,
            onGeoLocationChanged: this.handleGeoLocationChanged,
            onRegionSelected: this.handleRegionSelected,
            onDateChanged: this.handleDateChanged,
            onPickupClick: this.handlePickupClick,
            onDeliveryClick: this.handleDeliveryClick
        }

        return isMobile ? <MobileSearch {...searchProps} /> : <DesktopSearch {...searchProps} />;
    }
}

const mapStateToProps = (state) => {
    return {
        pickup: Selectors.getPickup(state),
        isLoading: Selectors.getIsLoading(state),
        foods: Selectors.getFoods(state),
        geo: Selectors.getGeoLocation(state),
        region: Selectors.getRegion(state),
        date: Selectors.getDate(state),
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
    isLoading: PropTypes.bool.isRequired,
    pickup: PropTypes.bool.isRequired,

    actions: PropTypes.shape({
        selectPickup: PropTypes.func.isRequired,
        selectDelivery: PropTypes.func.isRequired,
        requestFoods: PropTypes.func.isRequired,
        requestFoodsInRegion: PropTypes.func.isRequired,
        requestCurrentGeoLocation: PropTypes.func.isRequired,
        geoLocationChanged: PropTypes.func.isRequired,
        regionChanged: PropTypes.func.isRequired,
        dateChanged: PropTypes.func.isRequired
    }).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);