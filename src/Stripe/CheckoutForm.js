import React from 'react';
import './CheckoutForm.css'
import {
    CardNumberElement,
    CardExpiryElement,
    CardCVCElement,
    PostalCodeElement,
    injectStripe,
} from 'react-stripe-elements'


const handleBlur = () => {
    console.log('[blur]');
};
const handleChange = change => {
    console.log('[change]', change);
};
// const handleClick = () => {
//     console.log('[click]');
// };
const handleFocus = () => {
    console.log('[focus]');
};
const handleReady = () => {
    console.log('[ready]');
};

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

    stripeTokenHandler(token) {
        console.log('token=' + token);
    }

    handleSubmit(e) {
        //e.preventDefault();

        this.props.stripe.createToken()
            .then(payload => {
                if (payload.error) {
                    // Inform the customer that there was an error
                    console.error(payload.error.message);
                } else {
                    // Send the token to your server
                    this.stripeTokenHandler(payload.token);
                }
            });
    };

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

    render() {
        return (
            <div>
                <label className='checkoutform-label'>
                    Card number
                    <CardNumberElement
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onReady={handleReady}
                        {...createOptions(this.props.fontSize) }
                    />
                </label>
                <label className='checkoutform-label'>
                    Expiration date
                    <CardExpiryElement
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onReady={handleReady}
                        {...createOptions(this.props.fontSize) }
                    />
                </label>
                <label className='checkoutform-label'>
                    CVC
                    <CardCVCElement
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onReady={handleReady}
                        {...createOptions(this.props.fontSize) }
                    />
                </label>
                <label className='checkoutform-label'>
                    Postal code
                    <PostalCodeElement
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onReady={handleReady}
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