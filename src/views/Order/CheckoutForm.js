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

    state = {};

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

    handleCardNameBlur = (e) => {
        if (this.props.onBlur) {
            this.props.onBlur({ elementType: 'cardName' });
        }
    }

    handleCardNameFocus = (e) => {
        if (this.props.onFocus) {
            this.props.onFocus({ elementType: 'cardName' });
        }
    }

    handleCardNameChange = (e) => {
        if (this.props.onChange) {
            const hasValue = !(!e.target.value);
            const cardName = {
                elementType: 'cardName',
                complete: hasValue,
                empty: !hasValue,
                value: e.target.value
            };
            if (!hasValue) {
                cardName.error = {
                    code: 'incomplete_card_name',
                    type: 'validation_error',
                    message: 'You card name is empty'
                };
            }
            this.props.onChange(cardName);
        }
    }

    render() {
        const fontSize = '14px';
        const { onBlur, onChange, onFocus } = this.props;

        return (
            <div className="checkout">
                <div className='checkout-detail'>
                    <div id='checkout-card-number'>
                        <label>Card number</label>
                        <CardNumberElement
                            onBlur={onBlur}
                            onChange={onChange}
                            onFocus={onFocus}
                            {...createOptions(fontSize)}
                        />
                    </div>
                    <div id='checkout-expiry-date'>
                        <label>Expiration date</label>
                        <CardExpiryElement
                            onBlur={onBlur}
                            onChange={onChange}
                            onFocus={onFocus}
                            {...createOptions(fontSize)}
                        />
                    </div>

                    <div id='checkout-cvc'>
                        <label>Security code</label>

                        <CardCVCElement
                            onBlur={onBlur}
                            onChange={onChange}
                            onFocus={onFocus}
                            {...createOptions(fontSize)}
                        />
                    </div>
                </div>

                <div className='checkout-detail'>

                    <div id='checkout-name'>
                        <label>Name on card</label>
                        <div>
                            <Input placeholder='John Smith'
                                onBlur={this.handleCardNameBlur}
                                onFocus={this.handleCardNameFocus}
                                onChange={this.handleCardNameChange}
                            />
                        </div>
                    </div>

                    <div id='checkout-postal-code'>
                        <label>Postal code</label>
                        <PostalCodeElement
                            onBlur={onBlur}
                            onChange={onChange}
                            onFocus={onFocus}
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