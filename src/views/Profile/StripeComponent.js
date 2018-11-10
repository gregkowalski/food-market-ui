import React from 'react'
import { Button, Image, Divider, Icon } from 'semantic-ui-react'
import './StripeComponent.css'

const StripeComponent = ({ has_stripe_account, onConnectStripe }) => {

    if (has_stripe_account) {
        return (
            <div className='stripecomponent-box'>
                <div className='stripecomponent-text'>
                    <div>Sharing your food just got a whole lot easier.</div>
                    <div className='stripecomponent-logo'>
                        <Icon color='green' size='big' name='checkmark' />
                        <Image height='45px' src='/assets/images/stripe-logo-blue.png' />
                    </div>
                    <div> Your Stripe account is successfully connected to Foodcraft.</div>
                    <Divider hidden />
                    <div> Be sure to check out the Foodcraft Help Center for more information, tips, and answers to many frequently asked questions.</div>
                    <Divider hidden />
                    <div className='stripecomponent-ready'> Ready to get started? </div>
                    <Divider hidden />
                    <a href='https://goo.gl/forms/NxxOMSNXOWESGpsW2' target='_blank' rel="noreferrer noopener" >
                        <Button basic color='purple'>Add a new food</Button>
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className='stripecomponent-box'>
            <div className='stripecomponent-menu' style={{ marginBottom: '20px' }}>
                Interested in sharing your food and making money with Foodcraft?
                <div style={{ marginTop: '10px' }}>
                    Get started by creating your own Stripe account!
                </div>
            </div>
            <a href='./' onClick={onConnectStripe}>
                <Image src='/assets/images/stripe-blue-on-light.png' />
            </a>
        </div>
    );
}

export default StripeComponent;