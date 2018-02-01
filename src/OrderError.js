import React from 'react'
import { Icon } from 'semantic-ui-react'
import AppHeader from './components/AppHeader'
import { Constants } from './Constants'
import ApiClient from './Api/ApiClient'

export default class OrderError extends React.Component {

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
        
        return (
            <div>
                <AppHeader />
                <div style={{ marginLeft: '1em', marginTop: '2em' }}>
                <h1 style={{ color: '#f35656' }}>Oops!!!</h1>
                <span>It looks like your delicious order of <strong>{this.food.title} </strong>has<span style={{ color: '#f35656' }}> NOT</span> been placed!
                <br />
                    Please return to
                    <a href="/" className='head-link'>
                        <div style={{ fontSize: '1em', fontWeight: 'bold', display: 'inline' }}><Icon name='home' />{Constants.AppName}</div>
                    </a></span>
            </div>
            </div>

        );
    }
}