import React from 'react'
import Autocomplete from 'react-google-autocomplete';
import { Icon, Message, Radio } from 'semantic-ui-react'
import { Header, Divider, Segment, Input } from 'semantic-ui-react'
import ContactMethods from '../../data/ContactMethods'
import './ContactInfo.css'

class ContactInfo extends React.Component {

    handleContactMethodChange = (e, { value }) => {
        this.props.onContactMethodChange(value);
    }

    autocompleteStyle(isValid) {
        const style = {};
        if (isValid) {
            style.border = '1px solid rgba(34, 36, 38, .15)';
        }
        else {
            style.border = '1px solid #e0b4b4';
            style.backgroundColor = '#fff6f6';
        }
        return style;
    }

    render() {
        const { pickup, contactMethod,
            buyerPhone, isBuyerPhoneValid, onPhoneNumberChange, onPhoneNumberBlur,
            buyerAddress, isBuyerAddressValid, onAddressChange, onAddressSelected, onAddressBlur
        } = this.props;

        const showPhoneError = contactMethod === ContactMethods.phone && !isBuyerPhoneValid;

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
                        <Radio
                            label='Email'
                            name='contactMethodRadioGroup'
                            value={ContactMethods.email}
                            checked={contactMethod === ContactMethods.email}
                            onChange={this.handleContactMethodChange}
                        />
                    </div>
                    <div className='contactinfo-option'>
                        <Radio
                            label='Phone'
                            name='contactMethodRadioGroup'
                            value={ContactMethods.phone}
                            checked={contactMethod === ContactMethods.phone}
                            onChange={this.handleContactMethodChange}
                        />
                    </div>
                </div>
                <div className='contactinfo-phone'>
                    <Input name='phone' type='tel' placeholder='604 111 2222' value={buyerPhone}
                        disabled={contactMethod !== ContactMethods.phone}
                        error={showPhoneError}
                        onChange={onPhoneNumberChange} onBlur={onPhoneNumberBlur} />
                    <Message header='Invalid phone number' content='Please enter your phone number' icon='exclamation circle'
                        error={showPhoneError} hidden={!showPhoneError} visible={showPhoneError} />
                </div>

                {!pickup &&
                    <div className='contactinfo-address'>
                        <div>I chose <span>delivery</span> for my order: </div>
                        <div>Where will the food delivered to?</div>
                        <Autocomplete
                            style={this.autocompleteStyle(isBuyerAddressValid)}
                            name='address'
                            onPlaceSelected={onAddressSelected}
                            onChange={onAddressChange}
                            onBlur={onAddressBlur}
                            types={['address']}
                            placeholder='Your delivery address'
                            componentRestrictions={{ country: 'ca' }}
                            value={buyerAddress} />
                        <Message
                            error={!isBuyerAddressValid}
                            hidden={isBuyerAddressValid}
                            visible={!isBuyerAddressValid}
                            header='Invalid address'
                            content='Please enter your delivery address' />
                    </div>
                }

            </Segment >
        );
    }
}

export default ContactInfo;