import React from 'react';
import './CheckoutForm.css'
import {
    CardNumberElement,
    CardExpiryElement,
    CardCVCElement,
    PostalCodeElement,
    injectStripe,
} from 'react-stripe-elements'
import { Input } from 'semantic-ui-react'

const createOptions = (fontSize) => {
    return {
        style: {
            base: {
                fontSize,
                // color: '#424770',
                color: 'rgba(0,0,0,.87)',
                letterSpacing: '0.025em',
                // fontFamily: 'Roboto',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
    };
};

class CheckoutForm extends React.Component {

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined);
        }
    }

    handleBlur = () => {
        if (this.props.onBlur) {
            this.props.onBlur();
        }
    }

    handleChange = change => {
        // console.log('[change]', change);
    }

    handleFocus = () => {
        // console.log('[focus]');
    }

    handleReady = () => {
        // console.log('[ready]');
    }

    render() {
        const fontSize = '1em';

        return (
            <div className="checkout">
                <div className='checkout-detail'>
                    <div id='checkout-card-number'>
                        <label>Card number</label>
                        <CardNumberElement
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            onFocus={this.handleFocus}
                            onReady={this.handleReady}
                            {...createOptions(fontSize)}
                        />
                    </div>
                    <div id='checkout-expiry-date'>
                        <label>Expiration date</label>
                        <CardExpiryElement
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            onFocus={this.handleFocus}
                            onReady={this.handleReady}
                            {...createOptions(fontSize)}
                        />
                    </div>

                    <div id='checkout-cvc'>
                        <label>Security code</label>

                        <CardCVCElement
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            onFocus={this.handleFocus}
                            onReady={this.handleReady}
                            {...createOptions(fontSize)}
                        />
                    </div>
                </div>

                <div className='checkout-detail'>

                    <div id='checkout-name'>
                        <label>Name on card</label>
                        <div>
                            <Input placeholder='John Smith' />
                        </div>
                    </div>

                    <div id='checkout-postal-code'>
                        <label>Postal code</label>
                        <PostalCodeElement
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            onFocus={this.handleFocus}
                            onReady={this.handleReady}
                            placeholder='Postal code'
                            {...createOptions(fontSize)}
                        />
                    </div>

                </div>
            </div>
        );
    }
}
export default injectStripe(CheckoutForm);