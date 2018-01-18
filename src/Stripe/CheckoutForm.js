import React from 'react';
import './CheckoutForm.css'
import {
    CardNumberElement,
    CardExpiryElement,
    CardCVCElement,
    PostalCodeElement,
    injectStripe,
} from 'react-stripe-elements'

const createOptions = (fontSize) => {
    return {
        style: {
            base: {
                fontSize,
                color: '#424770',
                letterSpacing: '0.025em',
                fontFamily: 'Source Code Pro, monospace',
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

    // stripeTokenHandler(token) {
    //     console.log('token=' + token);
    // }

    // handleSubmit(e) {
    //     //e.preventDefault();

    //     this.props.stripe.createToken()
    //         .then(payload => {
    //             if (payload.error) {
    //                 // Inform the customer that there was an error
    //                 console.error(payload.error.message);
    //             } else {
    //                 // Send the token to your server
    //                 this.stripeTokenHandler(payload.token);
    //             }
    //         });
    // };

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
        console.log('[blur]');
        if (this.props.onBlur) {
            this.props.onBlur();
        }
    }

    handleChange = change => {
        console.log('[change]', change);
    }

    // const handleClick = () => {
    //     console.log('[click]');
    // };

    handleFocus = () => {
        console.log('[focus]');
    }

    handleReady = () => {
        console.log('[ready]');
    }

    render() {
        return (
            <div>
                <label className='checkoutform-label'>
                    Card number
                    <CardNumberElement
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onReady={this.handleReady}
                        {...createOptions(this.props.fontSize) }
                    />
                </label>
                <label className='checkoutform-label'>
                    Expiration date
                    <CardExpiryElement
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onReady={this.handleReady}
                        {...createOptions(this.props.fontSize) }
                    />
                </label>
                <label className='checkoutform-label'>
                    CVC
                    <CardCVCElement
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onReady={this.handleReady}
                        {...createOptions(this.props.fontSize) }
                    />
                </label>
                <label className='checkoutform-label'>
                    Postal code
                    <PostalCodeElement
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onReady={this.handleReady}
                        placeholder='Postal code'
                        {...createOptions(this.props.fontSize) }
                    />
                </label>
                {/* <button onClick={(e) => this.handleSubmit(e)}>Pay NOW!</button> */}
            </div>
        );
    }
}
export default injectStripe(CheckoutForm);