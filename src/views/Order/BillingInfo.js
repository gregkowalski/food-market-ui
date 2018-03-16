import React from 'react'
import { Image, Message, Header, Divider, Segment } from 'semantic-ui-react'
import { Elements } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';
import './BillingInfo.css'

class BillingInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = { hasErrors: {} };
    }

    handleCheckoutBlur = () => {
        if (this.state.hasErrors.payment) {
            this.setState({ hasErrors: { payment: false } });
        }
    };

    render() {
        const { paymentError, onCardNameChange, onCheckoutRef } = this.props;
        const { hasErrors } = this.state;

        return (
            <Segment padded>
                <div className='billing'>
                    <Image height='40px' src='/assets/images/padlock.png' />
                    <div className='billing-header'>
                        <Header>Billing Information</Header>
                        <div className='billing-powered-by-stripe'>
                            <div>POWERED BY</div>
                            <Image height='28px' width='75px' src='/assets/images/stripe-logo-blue.png' />
                        </div>
                    </div>
                </div>
                <Divider />
                <Elements>
                    <CheckoutForm onRef={onCheckoutRef} onBlur={this.handleCheckoutBlur} onCardNameChange={onCardNameChange} />
                </Elements>
                <Message header={paymentError} icon='exclamation circle'
                    error={hasErrors.payment}
                    hidden={!hasErrors.payment}
                    visible={hasErrors.payment} />
            </Segment>
        );
    }
}

export default BillingInfo;