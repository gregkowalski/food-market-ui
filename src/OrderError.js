import React from 'react'
import FoodItems from './data/FoodItems'
import { Image } from 'semantic-ui-react'
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
        return (

        <div className='wrap'>

                <div className='head'>
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
                    <div style={{marginLeft: '1em', marginTop: '5em'}}>
                    <h1 style={{color: 'red'}}>Oops!!!</h1>
                    <span>It looks like your delicious order of <strong>{food.header} </strong>has<span style={{color: 'red'}}> NOT</span> been placed! 
                <br>
                </br>
                    Please return to <a href="/"> <div style={{ fontSize: '1em', fontWeight: 'bold', display: 'inline' }}>foodcraft
                    </div></a>.</span>
                </div>
            </div>
        </div>

        );
    }
}