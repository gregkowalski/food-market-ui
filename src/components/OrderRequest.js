import React from 'react'
import { Divider, Button, Rating, Dropdown, Radio } from 'semantic-ui-react'
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
        this.state = { pickup: true };
    }

    triggerFilterChange() {
        if (this.props.onFilterChange) {
            this.props.onFilterChange({ date: this.state.date });
        }
    }

    handleDateChange = (date) => this.setState({ date: date }, () => this.triggerFilterChange());
    handleTimeChange = (event, data) => this.setState({ time: data.value });
    handleQuantityIncrement = () => this.props.onQuantityChange(this.props.quantity + 1);
    handleQuantityDecrement = () => this.props.onQuantityChange(this.props.quantity - 1);
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
        const { food, quantity, onOrderButtonClick, onHide } = this.props;
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

                    <div className='mobileorder-input-descriptions'>
                        We take your privacy seriously. Your address is never shown publicly. We use this data to improve our geosearch and matching.
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
                        <div>
                            <Button circular basic color='teal' size='huge' icon='minus' onClick={this.handleQuantityDecrement} />
                            <div>{quantity}</div>
                            <Button circular basic color='teal' size='huge' icon='plus' onClick={this.handleQuantityIncrement} />
                        </div>
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