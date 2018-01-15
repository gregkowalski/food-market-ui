import React from 'react';
import { Elements } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';
import './Checkout.css'

export default class Checkout extends React.Component {

    render() {
        return (
            <div className="Checkout">
                <Elements>
                    <CheckoutForm onRef={ref => this.props.onRef(ref)} />
                </Elements>
            </div>
        );
    }
}