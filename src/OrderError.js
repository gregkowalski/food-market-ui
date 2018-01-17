import React from 'react'
import { Icon } from 'semantic-ui-react'
import FoodItems from './data/FoodItems'
import AppHeader from './components/AppHeader'
import { Constants } from './Constants'

export default class OrderError extends React.Component {

    state = {
        quantity: 1,
        showPricingDetails: false,
        serviceFeeRate: 0.03
    };

    getFoodItemId() {
        return this.props.match.params.id;
    }

    componentWillMount() {
        let id = this.getFoodItemId();
        // eslint-disable-next-line 
        let food = FoodItems.find(x => x.id == id);
        document.title = food.header;
    }

    render() {
        let id = this.getFoodItemId();
        // eslint-disable-next-line 
        let food = FoodItems.find(x => x.id == id);
        return (
            <div>
                <AppHeader />
                <div style={{ marginLeft: '1em', marginTop: '2em' }}>
                <h1 style={{ color: '#f35656' }}>Oops!!!</h1>
                <span>It looks like your delicious order of <strong>{food.header} </strong>has<span style={{ color: '#f35656' }}> NOT</span> been placed!
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