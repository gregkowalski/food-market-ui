import React from 'react'
import FoodItems from './data/FoodItems'
import queryString from 'query-string'
import { Image } from 'semantic-ui-react'
import { Constants } from './Constants'

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


            <div className='wrap'>

                <div className='headscroll'>
                    <div className='head-content'>
                        <div className='head-logo'>
                            <a href="/">
                                <Image style={{ margin: '0 auto' }} height='24px' src='/assets/images/heart.png' />
                            </a>
                            <a href="/" className='link'>
                                <div style={{ fontSize: '1.4em', fontWeight: 'bold' }}>{Constants.AppName}</div>
                            </a>
                            <div id="content-desktop" style={{ fontSize: '1.1em', fontWeight: 'bold', marginLeft: '2px' }}>
                                local. homemade. fresh.
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bodywrap'>
                    <div style={{ marginLeft: '1em', marginTop: '5em' }}>
                        <h1>Success</h1>
                        <span>Your <strong>{food.header}</strong> order has been placed{message}!</span>
                    </div>
                </div>
            </div>

        );
    }
}
