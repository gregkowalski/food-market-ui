import React from 'react'
import FoodItems from './data/FoodItems'
import queryString from 'query-string'

export default class Order extends React.Component {

    state = {
        quantity: 1,
        showPricingDetails: false,
        serviceFeeRate: 0.03
    };

    getFoodItemId() {
        return this.props.match.params.id;
    }

    componentDidMount() {
        let id = this.getFoodItemId();
        // eslint-disable-next-line 
        let food = FoodItems.find(x => x.id == id);
        document.title = food.header;
    }

    render() {
        let id = this.getFoodItemId();
        // eslint-disable-next-line 
        let food = FoodItems.find(x => x.id == id);

        let message = '';
        const query = queryString.parse(this.props.location.search);
        if (query.sentCount) {
            let sentCount = parseInt(query.sentCount, 10);
            if (sentCount && sentCount > 1) {
                message = ' and you should receive a confirmation email'
            }
        }

        return (
            <div style={{marginLeft: '1em', marginTop: '1em'}}>
                <h1>Success</h1>
                <span>Your <strong>{food.header}</strong> order has been placed{message}!</span>
            </div>
        );
    }
}