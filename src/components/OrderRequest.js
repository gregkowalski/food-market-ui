import React from 'react'
import Autocomplete from 'react-google-autocomplete';
import { Divider, Button, Rating, Input, Message, Dropdown, Radio } from 'semantic-ui-react'
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './OrderRequest.css'
import '../views/FoodDetail.css'
import Util from '../services/Util'
import PriceCalc from '../services/PriceCalc'
import Constants from '../Constants'

export default class OrderRequest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hasErrors: {},
            address: '',
            pickup: true
        };
    }

    handleDateChange = (date) => {
        this.setState({ date: date }, () => this.triggerFilterChange());
    };

    handleTimeChange = (event, data) => {
        this.setState({ time: data.value });
    };

    triggerFilterChange() {
        if (this.props.onFilterChange) {
            this.props.onFilterChange({ date: this.state.date });
        }
    }

    handleQuantityIncrement = () => this.props.onQuantityChange(this.props.quantity + 1);
    handleQuantityDecrement = () => this.props.onQuantityChange(this.props.quantity - 1);
    handleQuantityUpdate = (e, { value }) => this.props.onQuantityChange(value);

    handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        let newHasBlurred = Object.assign({}, this.state.hasBlurred);
        newHasBlurred[name] = true;
        let newState = {
            [name]: value,
            hasBlurred: newHasBlurred,
            hasChanges: true
        };

        console.log(name + ': ' + value);
        this.setState(newState, () => this.validateField(name, value));
    }

    handleAddressChange = (place) => {
        const value = place.formatted_address;
        this.setState({ address: value, hasChanges: true }, () => this.validateField('address', value))
    }

    handleBlur = (e) => {
        const name = e.target.name;
        console.log('Blur: ' + name);

        let hasBlurred = Object.assign({}, this.state.hasBlurred);
        hasBlurred[name] = true;
        this.setState({ hasBlurred: hasBlurred }, () => { this.validateField(name) });
    }

    isValid(hasErrors) {
        for (let v in hasErrors) {
            if (hasErrors[v] === true) {
                return false;
            }
        }
        return true;
    }

    validateField(fieldName, fieldValue) {
        if (!fieldValue) {
            fieldValue = this.state[fieldName];
        }

        let hasBlurred = this.state.hasBlurred;
        let state = this.state;
        let hasErrors = {};

        switch (fieldName) {

            case 'phone':
                hasErrors.phone = false;
                if (hasBlurred.phone && !this.validatePhoneNumber(state.phone)) {
                    hasErrors.phone = true;
                }
                break;

            case 'email':
                hasErrors.email = false;
                if (hasBlurred.email && !this.validateEmail(state.email)) {
                    hasErrors.email = true;
                }
                break;

            case 'address':
            case 'name':
            case 'city':
            case 'username':
            case 'info':
            case 'lang':
                hasErrors[fieldName] = false;
                if (hasBlurred[fieldName] && !state[fieldName]) {
                    hasErrors[fieldName] = true;
                }
                break;

            default:
                break;
        }

        hasErrors = Object.assign(this.state.hasErrors, hasErrors);
        this.setState({ hasErrors });
    }

    handleRadioChange = (e, { value }) => this.setState({ value });

    hideForPickup = (pickup) => {
        const style = {};
        if (pickup) {
            style.display = 'none';
        }
        return style;
    }

    getTotalPrice(food, quantity, pickup) {
        let total = PriceCalc.getTotal(food.price, quantity);
        if (!pickup) {
            total += Constants.DeliveryFee;
        }
        return total;
    }

    render() {
        const { food, quantity, onOrderButtonClick, onQuantityInputBlur, onHide } = this.props;
        const { pickup } = this.state;

        const OrderTimes = [
            { key: 0, text: 'Breakfast (7 AM - 11 AM)', value: 0 },
            { key: 1, text: 'Lunch (11 AM - 3 PM)', value: 1 },
            { key: 2, text: 'Dinner (3 PM - 7 PM)', value: 2 },
        ];

        return (
            <div>
                <div className='mobileorder'>

                    <OrderRequestHeader food={food} onClose={onHide} />

                    <div className='mobileorder-delivery'>
                        <div onClick={() => this.setState({ pickup: true })}>
                            <Radio name='delivery-option' checked={pickup} />
                            <span>Pickup from cook</span>
                        </div>
                        <div onClick={() => this.setState({ pickup: false })}>
                            <Radio name='delivery-option' checked={!pickup} />
                            <span>Deliver to my address for ${Constants.DeliveryFee}</span>
                        </div>
                    </div>

                    <div className='mobileorder-address' style={this.hideForPickup(pickup)}>
                        <Autocomplete
                            name='address'
                            onPlaceSelected={this.handleAddressChange}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            types={['address']}
                            placeholder='Delivery Address'
                            componentRestrictions={{ country: 'ca' }}
                            value={this.state.address} />
                        <Message
                            error={this.state.hasErrors.address}
                            hidden={!this.state.hasErrors.address}
                            visible={this.state.hasErrors.address} header='Invalid address' content='Please enter your address' icon='exclamation circle' />
                        <div className='mobileorder-input-descriptions'>
                            We take your privacy seriously. Your address is never shown publicly. We use this data to improve our geosearch and matching.
                        </div>
                    </div>

                    <div className='mobileorder-row'>
                        <div className='mobileorder-date'>
                            <div>Date</div>
                            <SingleDatePicker
                                date={this.state.date}
                                isOutsideRange={Util.isDayOutsideRange}
                                onDateChange={this.handleDateChange}
                                focused={this.state.focused}
                                onFocusChange={({ focused }) => this.setState({ focused })}
                                numberOfMonths={1}
                                placeholder="What day?"
                                displayFormat={() => 'MMM D, YYYY'}
                            />
                        </div>
                        <div className='mobileorder-time'>
                            <div>Time</div>
                            <Dropdown selection
                                placeholder='What Time?'
                                options={OrderTimes}
                                onChange={this.handleTimeChange}
                                value={this.state.time}
                            />
                        </div>
                    </div>
                    <div className='mobileorder-quantity'>
                        <div>Quantity ({food.unit} per order)</div>
                        <Button icon='minus' onClick={this.handleQuantityDecrement} />
                        <Input type='number' min={1} max={99} value={quantity}
                            onChange={this.handleQuantityUpdate}
                            onBlur={onQuantityInputBlur}
                        />
                        <Button icon='plus' onClick={this.handleQuantityIncrement} />
                    </div>

                    <div className='mobileorder-summary'>

                        <div className='mobileorder-summary-row'>
                            <div className='mobileorder-summary-left'>${PriceCalc.getTotal(food.price, quantity)} x {quantity} order size</div>
                            <div className='mobileorder-summary-right'>${PriceCalc.getTotal(food.price, quantity)}</div>
                        </div>

                        <Divider style={this.hideForPickup(pickup)} />

                        <div className='mobileorder-summary-row' style={this.hideForPickup(pickup)}>
                            <div className='mobileorder-summary-left'>Delivery Fee</div>
                            <div className='mobileorder-summary-right'>${Constants.DeliveryFee}</div>
                        </div>

                        <Divider />

                        <div className='mobileorder-summary-row'>
                            <div className='mobileorder-summary-left'>
                                <span style={{ fontWeight: 700 }}>Total</span>
                            </div>
                            <div className='mobileorder-summary-right'>
                                <span style={{ fontWeight: 500 }}> ${this.getTotalPrice(food, quantity, pickup)}</span>
                            </div>
                        </div>

                        <div className='mobileorder-footer'>
                            <Button onClick={onOrderButtonClick}>Request an Order</Button>
                            <div>You won't be charged yet</div>
                        </div>
                    </div>

                </div>

            </div >
        );
    }
}

const OrderRequestHeader = ({ food, onClose }) => {
    return (
        <div className='mobileorder-row mobileorder-border'>
            <div className='mobileorder-header-left'>
                <div className='mobileorder-close' onClick={onClose}>
                    &times;
                </div>
                <div className='mobileorder-price'>
                    <span>${food.price} CAD</span>
                    <span> / order</span>
                </div>
                <div className='mobileorder-rating'>
                    <Rating disabled={true} maxRating={5} rating={food.rating} size='mini' />
                    <div>{food.ratingCount}</div>
                </div>
            </div>
            <div className='mobileorder-header-right'>
                <span>{food.title}</span>
            </div>
        </div>
    );
}