import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'
import './FoodFilter.css'
import DeliveryOptionModal from './DeliveryOptionModal'
import DateModal from './DateModal'
import Autocomplete from '../../../components/Autocomplete'
import Util from '../../../services/Util'

export default class FoodFilter extends React.Component {

    state = { address: '' };

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

    handleDeliveryOptionApply = (pickup) => {
        const { onDeliveryOptionChanged, onShowFilter } = this.props;
        this.hideFilters();
        onShowFilter(false);
        onDeliveryOptionChanged(pickup);
    }

    handleDateApply = (date) => {
        const { onShowFilter, onDateChanged } = this.props;

        this.hideFilters();
        onShowFilter(false);
        onDateChanged(date);
    }

    handleDeliveryAddressSelected = (place) => {
        if (place && place.geometry) {
            const { onDeliveryAddressSelected } = this.props;
            onDeliveryAddressSelected(place);

            this.setState({ address: Util.toFormattedAddress(place) });
        }
    }

    handleDeliveryAddressChange = (event) => {
        this.setState({ address: event.target.value });
    }

    getButtonProps(active) {
        const props = {};
        if (!active) {
            props.basic = true;
        }
        return props;
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
            <div>

                <div id='foodfilter-filters'>
                    <Button color='purple' {...this.getButtonProps(date)} onClick={this.toggleDateFilter}>
                        {date ? date.format("MMM D, YYYY") : "Date"}
                    </Button>
                    <Button color='purple' ref={this.setDeliveryOptionButtonRef} onClick={this.toggleDeliveryOptionFilter}>
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
                    onApply={this.handleDeliveryOptionApply}
                />
            </div>
        );
    }
}

FoodFilter.propTypes = {
    show: PropTypes.bool.isRequired,
    onShowFilter: PropTypes.func.isRequired,
    onHideFilter: PropTypes.func.isRequired,
    onDeliveryOptionChanged: PropTypes.func.isRequired,
    onDeliveryAddressSelected: PropTypes.func.isRequired,
    onDateChanged: PropTypes.func.isRequired
}
