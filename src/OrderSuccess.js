import React from 'react'
import queryString from 'query-string'
import AppHeader from './components/AppHeader'
import ApiClient from './Api/ApiClient'

export default class OrderSuccess extends React.Component {

    state = {
        quantity: 1,
        showPricingDetails: false,
        serviceFeeRate: 0.03
    };

    food;

    componentWillMount() {
        let apiClient = new ApiClient();
        apiClient.getFood(this.props.match.params.id)
            .then(response => {                
                this.food = response.data;

                document.title = this.food.title;
            })
            .catch(err => {
                console.error(err);
            });
    }

    render() {
        if (!this.food) {
            return null;
        }

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
                <h1 style={{ color: '#4cb9a0' }}>Success!</h1>
                    <span>Your <strong>{this.food.title}</strong> order has been placed{message}.</span>
                </div>
            </div>
        );
    }
}
