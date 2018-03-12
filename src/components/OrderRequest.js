import React from 'react'
import { Button, Rating } from 'semantic-ui-react'
import './OrderRequest.css'
import '../views/FoodDetail.css'
import DeliverySelector from './DeliverySelector'
import DateTimeSelector from './DateTimeSelector'
import QuantitySelector from './QuantitySelector'
import OrderPriceSummary from './OrderPriceSummary'
import OrderRequestHeader from './OrderRequestHeader'

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
    handleQuantityChange = (delta) => this.props.onQuantityChange(this.props.quantity + delta);
    handleDeliveryOptionChange = (pickup) => this.setState({ pickup });
   
    render() {
        const { food, quantity, onOrderButtonClick, onHide } = this.props;
        const { pickup, date, time } = this.state;

        return (
            <div>
                <div className='mobileorder'>

                    <OrderRequestHeader food={food} onClose={onHide} />
                    <DeliverySelector pickup={pickup} onChange={this.handleDeliveryOptionChange} />
                    <DateTimeSelector date={date} time={time}
                        onDateChange={this.handleDateChange}
                        onTimeChange={this.handleTimeChange} />
                    <QuantitySelector food={food} quantity={quantity} onChange={this.handleQuantityChange} />

                    {/* <div className='mobileorder-input-descriptions'>
                        We take your privacy seriously. Your address is never shown publicly. We use this data to improve our geosearch and matching.
                    </div> */}

                    <OrderPriceSummary food={food} quantity={quantity} pickup={pickup} />

                    <div className='mobileorder-footer'>
                        <Button onClick={onOrderButtonClick}>Request an Order</Button>
                        <div>You won't be charged yet</div>
                    </div>

                </div>

            </div >
        );
    }
}