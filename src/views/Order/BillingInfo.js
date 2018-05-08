import React from 'react'
import { Image, Header, Divider, Segment } from 'semantic-ui-react'
import { Elements } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';
import './BillingInfo.css'

class BillingInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            form: {
                cardNumber: {},
                cardName: {},
                cardExpiry: {},
                cardCvc: {},
                postalCode: {}
            }
        };
    }

    componentDidMount() {
        if (this.props.onBillingInfoChange) {
            this.props.onBillingInfoChange(this.state.form);
        }
    }

    updateFormState(e, newState) {
        const { form } = this.state;
        const elementState = form[e.elementType];
        const event = Object.assign({}, elementState, e, newState);
        const newForm = Object.assign({}, form, {
            [event.elementType]: event
        });
        this.setState({ form: newForm });

        if (this.props.onBillingInfoChange) {
            this.props.onBillingInfoChange(newForm);
        }
    }

    handleFocus = (e) => {
        this.updateFormState(e, { active: true });
    }

    handleBlur = (e) => {
        this.updateFormState(e, { visited: true, active: false });
    }

    handleChange = (e) => {
        this.updateFormState(e);
    }

    render() {
        const { onCheckoutRef } = this.props;

        return (
            <Segment padded>
                <div className='billing'>
                    <Image height='42px' src='/assets/images/padlock.png' />
                    <div className='billing-header'>
                        <Header>Billing</Header>
                        <div className='billing-powered-by-stripe'>
                            <div>POWERED BY</div>
                            <Image height='28px' width='75px' src='/assets/images/stripe-logo-blue.png' />
                        </div>
                    </div>
                </div>
                <Divider />
                <Elements>
                    <CheckoutForm
                        onRef={onCheckoutRef}
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                    />
                </Elements>
            </Segment>
        );
    }
}

export default BillingInfo;