import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Actions, Selectors } from '../../store/search'
import { Button } from 'semantic-ui-react'
import './FoodFilter.css'
import DeliveryOptionModal from './DeliveryOptionModal'
import DateModal from './DateModal'
import Autocomplete from '../../components/Autocomplete'
import RegionUtil from '../../components/Map/RegionUtil'
import Util from '../../services/Util'

class FoodFilter extends React.Component {

    getButtonProps(active) {
        const props = {};
        if (!active) {
            props.basic = true;
        }
        return props;
    }

    state = {};

    componentWillMount() {
        const { address } = this.props;
        if (address) {
            this.setState({ address: address.formatted_address });
        }
    }

    toggleDateFilter = () => {
        const show = !this.state.showDateFilter;
        this.setState({
            showDateFilter: show,
            showDeliveryOptionFilter: false
        });

        this.props.onShowFilter(show);
    }

    toggleDeliveryOptionFilter = () => {
        const deliveryOptionButton = ReactDOM.findDOMNode(this.deliveryOptionButton);
        const deliveryOptionButtonRect = deliveryOptionButton.getBoundingClientRect();
        const show = !this.state.showDeliveryOptionFilter;
        this.setState({
            showDateFilter: false,
            showDeliveryOptionFilter: show,
            showDeliveryOptionFilterLeft: deliveryOptionButtonRect.left
        });

        this.props.onShowFilter(show);
    }

    setDeliveryOptionButtonRef = (element) => {
        this.deliveryOptionButton = element;
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.show) {
            this.hideFilters();
        }
    }

    hideFilters = () => {
        this.setState({
            showDateFilter: false,
            showDeliveryOptionFilter: false
        });
    }

    handleDeliveryOptionsApply = (deliveryOptions) => {
        if (deliveryOptions.pickup) {
            this.props.actions.selectPickup();
        }
        else {
            this.props.actions.selectDelivery();
        }
        this.hideFilters();
        this.props.onShowFilter(false);
    }

    handleDateApply = (date) => {
        this.props.actions.dateChanged(date);
        this.hideFilters();
        this.props.onShowFilter(false);
    }

    handleDeliveryAddressSelected = (place) => {
        if (place && place.geometry) {
            const selectedLocation = Util.toLocation(place.geometry.location);
            const region = RegionUtil.getRegionByPosition(selectedLocation);
            this.props.actions.regionChanged(region);
            this.props.actions.mapCenterChanged(selectedLocation);
            this.props.actions.addressChanged(Util.toAddress(place));
            this.setState({ address: place.formatted_address });
        }
    }

    handleDeliveryAddressChange = (event) => {
        this.setState({ address: event.target.value });
    }

    render() {
        const { pickup, date, onHideFilter } = this.props;
        const { showDateFilter, showDeliveryOptionFilter, address } = this.state;

        let { showDeliveryOptionFilterLeft } = this.state;
        if (!showDeliveryOptionFilterLeft) {
            showDeliveryOptionFilterLeft = '138px';
        }

        const style = Object.assign({}, this.props.style);
        if (!style.height) {
            style.height = '55px';
        }

        return (
            <div className='foodfilter' style={style} >

                <div id='foodfilter-filters'>
                    <Button color='grey' {...this.getButtonProps(date)} onClick={this.toggleDateFilter}>
                        {date ? date.format("MMM D, YYYY") : "Date"}
                    </Button>
                    <Button ref={this.setDeliveryOptionButtonRef} color='grey' onClick={this.toggleDeliveryOptionFilter}>
                        {pickup ? 'Pickup' : 'Delivery'}
                    </Button>
                    {!pickup &&
                        <div id='foodfilter-address'>
                            <Autocomplete
                                types={['address']}
                                placeholder='Enter delivery address'
                                onPlaceSelected={this.handleDeliveryAddressSelected}
                                onChange={this.handleDeliveryAddressChange}
                                componentRestrictions={{ country: 'ca' }}
                                value={address}
                            />
                        </div>
                    }
                </div>

                <DateModal
                    isOpen={showDateFilter}
                    date={date}
                    onClose={onHideFilter}
                    onApply={this.handleDateApply}
                />

                <DeliveryOptionModal
                    style={{ left: showDeliveryOptionFilterLeft }}
                    isOpen={showDeliveryOptionFilter}
                    pickup={pickup}
                    onClose={onHideFilter}
                    onApply={this.handleDeliveryOptionsApply}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        date: Selectors.date(state),
        pickup: Selectors.pickup(state),
        address: Selectors.address(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};

FoodFilter.propTypes = {
    date: PropTypes.object,
    pickup: PropTypes.bool.isRequired,
    address: PropTypes.object,

    actions: PropTypes.shape({
        selectPickup: PropTypes.func.isRequired,
        selectDelivery: PropTypes.func.isRequired,
        dateChanged: PropTypes.func.isRequired,
        mapCenterChanged: PropTypes.func.isRequired,
        regionChanged: PropTypes.func.isRequired,
        addressChanged: PropTypes.func.isRequired,
    }).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(FoodFilter);

