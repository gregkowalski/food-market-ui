import React from 'react'
import { Field } from 'redux-form'
import { Header, Divider, Segment, Icon } from 'semantic-ui-react'
import './ContactInfo.css'
import { ContactMethods } from '../../Enums';
import { ValidatedField, ValidatedAutocomplete } from '../../components/Validation'
import Util from '../../services/Util'

class ContactInfo extends React.Component {

    handleContactMethodChange = (e, { value }) => {
        this.props.onContactMethodChange(value);
    }

    render() {
        const { pickup, contactMethod } = this.props;

        return (
            <Segment className='contactinfo'>
                <Header>
                    <Icon name='phone' />
                    Contact Information
                </Header>
                <div className='contactinfo-header'>
                    This will be kept private and will only be used for communication related to this order.
                </div>
                <Divider />
                <div className='contactinfo-contact'>
                    <div>I prefer to be contacted by:</div>
                    <div className='contactinfo-option'>
                        <Field id='contactinfo-option-email' name='contactMethod' component='input' type='radio' value={ContactMethods.email} />
                        <label htmlFor='contactinfo-option-email'>Email</label>
                    </div>
                    <div className='contactinfo-option'>
                        <Field id='contactinfo-option-phone' name='contactMethod' component='input' type='radio' value={ContactMethods.phone} />
                        <label htmlFor='contactinfo-option-phone'>Phone</label>
                    </div>
                </div>
                <div className='contactinfo-phone'>
                    <Field name='buyerPhone' autoComplete='buyerPhone' type='tel' placeholder="What's your phone number?"
                        disabled={contactMethod !== ContactMethods.phone} component={ValidatedField} parse={Util.getAsYouTypePhone} />
                </div>

                {!pickup &&
                    <div className='contactinfo-address'>
                        <div>I chose <span>delivery</span> for my order: </div>
                        <div>Where will the food delivered to?</div>
                        <Field name='buyerAddress' autoComplete='buyerAddress' component={ValidatedAutocomplete} type='text' placeholder='Your delivery address' />
                    </div>
                }

            </Segment>
        );
    }
}

export default ContactInfo;