import React from 'react'
import { Field } from 'redux-form'
import { Header, Segment, Icon } from 'semantic-ui-react'
import './DeliveryInfo.css'
import { ValidatedAutocomplete } from '../../components/Validation'

class DeliveryInfo extends React.Component {

    render() {
        return (
            <Segment className='deliveryinfo'>
                <Header>
                    <Icon name='shipping fast' />
                    Delivery
                </Header>
                <div className='deliveryinfo-address'>
                        <div>I chose <span>delivery</span> for my order: </div>
                        <div>Where will the food delivered to?</div>
                        <Field name='buyerAddress' autoComplete='buyerAddress' component={ValidatedAutocomplete}
                            type='text' placeholder='Your delivery address' />
                    </div>

            </Segment>
        );
    }
}

export default DeliveryInfo;