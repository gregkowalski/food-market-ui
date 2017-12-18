import React from 'react'
import FoodItems from './data/FoodItems'
import queryString from 'query-string'
import AppHeader from './components/AppHeader'

export default class OrderSuccess extends React.Component {

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
            <div>
                <AppHeader />
                <div style={{ marginLeft: '1em', marginTop: '2em' }}>
                <h1 style={{ color: '#52c5d5' }}>Success!</h1>
                    <span>Your <strong>{food.header}</strong> order has been placed{message}.</span>
                </div>
            </div>
        );
    }
}
