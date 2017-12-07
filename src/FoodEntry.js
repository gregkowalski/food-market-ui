import React from 'react'
import './Order.css'
import { Button, Image, Icon, Message, Dropdown, Checkbox } from 'semantic-ui-react'
import { Accordion, Header, Divider, Form, Segment, Input } from 'semantic-ui-react'
import FoodItems from './data/FoodItems'
import Suppliers from './data/Suppliers'
import AWS from 'aws-sdk'
import Autocomplete from 'react-google-autocomplete';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import { Route } from 'react-router-dom'
import moment from 'moment'
import { parse as parsePhone, asYouType as asYouTypePhone } from 'libphonenumber-js'

export default class FoodEntry extends React.Component {

    state = {
        hasBlurred: {},
        hasErrors: {}
    };

    handleAddressChange(place) {
        const value = place.formatted_address;
        this.setState({ address: value }, () => this.validateField('address', value))
    };

    handleQuantityChange(min, max, newValue) {
        if (newValue.length === 0) {
            this.setState({ quantity: newValue }, () => this.validateField('quantity', newValue));
            return;
        }
        let newQuantity = parseInt(newValue, 10);
        if (!newQuantity || isNaN(newQuantity) || newQuantity < min || newQuantity > max)
            return;

        this.setState({ quantity: newQuantity }, () => this.validateField('quantity', newQuantity));
    };

    handleClickQuantityChange(min, max, delta) {
        var quantity = this.state.quantity;
        if (quantity.length === 0) {
            quantity = 0;
        }
        let change = (delta > 0) ? 1 : -1;
        let newQuantity = quantity + change;
        if (newQuantity < min || newQuantity > max)
            return;

        let newState = { quantity: newQuantity };
        this.setState(newState, () => this.validateField('quantity', newQuantity));
    }

    handleDateChange(date) {
        const value = date.toDate()
        this.setState({ date: value }, () => this.validateField('date', value));
    };

    handleTimeChange = (event, data) => {
        const value = this.times.find(time => time.value === data.value).text
        this.setState({ time: value }, () => this.validateField('time', value));
    };

    handlePhoneNumberChange = (e) => {
        const name = e.target.name;
        let value = this.getAsYouTypePhone(e.target.value);
        e.target.value = value;

        let newHasBlurred = Object.assign({}, this.state.hasBlurred);
        newHasBlurred[name] = true;
        let newState = {
            [name]: value,
            hasBlurred: newHasBlurred
        };

        console.log(name + ': ' + value);
        this.setState(newState, () => this.validateField(name, value));
    }

    getAsYouTypePhone(value) {
        if (!value.startsWith('+1')) {
            if (value.startsWith('1')) {
                value = '+' + value;
            }
            else {
                value = '+1' + value;
            }
        }
        value = new asYouTypePhone('US').input(value);
        return value;
    }

    handleContactInfoChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        let newHasBlurred = Object.assign({}, this.state.hasBlurred);
        newHasBlurred[name] = true;
        let newState = {
            [name]: value,
            hasBlurred: newHasBlurred
        };

        console.log(name + ': ' + value);
        this.setState(newState, () => this.validateField(name, value));
    }

    handleContactInfoBlur = (e) => {
        const name = e.target.name;
        console.log('Blur: ' + name);

        let hasBlurred = Object.assign({}, this.state.hasBlurred);
        hasBlurred[name] = true;
        this.setState({ hasBlurred: hasBlurred }, () => { this.validateField(name) });
    }

    validateField(fieldName, fieldValue) {
        if (!fieldValue) {
            fieldValue = this.state[fieldName];
        }

        let hasBlurred = this.state.hasBlurred;
        let state = this.state;

        let hasErrors = {};

        switch (fieldName) {
            case 'quantity':
                let food = this.getFoodItem();
                hasErrors.quantity = false;
                if (!state.quantity || state.quantity < 1 || state.quantity > food.availability) {
                    hasErrors.quantity = true;
                }
                break;

            case 'firstName':
                hasErrors.firstName = false;
                if (hasBlurred.firstName && !state.firstName) {
                    hasErrors.firstName = true;
                }
                break;

            case 'lastName':
                hasErrors.lastName = false;
                if (hasBlurred.lastName && !state.lastName) {
                    hasErrors.lastName = true;
                }
                break;

            case 'phone':
                hasErrors.phone = false;
                if (hasBlurred.phone && !this.validatePhoneNumber(state.phone)) {
                    hasErrors.phone = true;
                }
                break;

            case 'email':
                hasErrors.email = false;
                if (hasBlurred.email && !this.validateEmail(state.email)) {
                    hasErrors.email = true;
                }
                break;

            case 'address':
                hasErrors.address = false;
                if (hasBlurred.address && !state.address) {
                    hasErrors.address = true;
                }
                break;

            default:
                break;
        }

        hasErrors = Object.assign(this.state.hasErrors, hasErrors);
        this.setState({ hasErrors });
    }

    validateForm() {
        let state = this.state;
        let hasErrors = {};

        let food = this.getFoodItem();
        hasErrors.quantity = false;
        if (!state.quantity || state.quantity < 1 || state.quantity > food.availability) {
            hasErrors.quantity = true;
        }

        hasErrors.firstName = false;
        if (!state.firstName) {
            hasErrors.firstName = true;
        }

        hasErrors.lastName = false;
        if (!state.lastName) {
            hasErrors.lastName = true;
        }

        hasErrors.phone = false;
        if (!this.validatePhoneNumber(state.phone)) {
            hasErrors.phone = true;
        }

        hasErrors.email = false;
        if (!this.validateEmail(state.email)) {
            hasErrors.email = true;
        }

        hasErrors.address = false;
        if (!state.address) {
            hasErrors.address = true;
        }

        hasErrors.date = false;
        if (!state.date) {
            hasErrors.date = true;
        }

        hasErrors.time = false;
        if (!state.time) {
            hasErrors.time = true;
        }

        hasErrors = Object.assign(this.state.hasErrors, hasErrors);
        this.setState({ hasErrors });
        return this.isValid(hasErrors);
    }

    validateEmail(email) {
        if (!email) {
            return false;
        }
        var pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(email);
    }

    validatePhoneNumber(phone) {
        if (!phone) {
            return false;
        }
        const result = parsePhone(phone);
        console.log('parsePhone: ' + JSON.stringify(result));
        return result.phone ? true : false;
    }

    isValid(hasErrors) {
        for (let v in hasErrors) {
            if (hasErrors[v] === true) {
                return false;
            }
        }
        return true;
    }

    dateCutoff = moment().add(36, 'hours');

    isDayOutsideRange = (day) => {

        const year1 = day.year();
        const month1 = day.month();
        const day1 = day.date();

        const year2 = this.dateCutoff.year();
        const month2 = this.dateCutoff.month();
        const day2 = this.dateCutoff.date();

        //console.log(`dateCutoff=${year2}-${month2}-${day2}, day=${year1}-${month1}-${day1}`);

        if (year1 !== year2)
            return year1 < year2;

        if (month1 !== month2)
            return month1 < month2;

        return day1 < day2;
    }

    handleOrderButtonClick() {
        if (!this.validateForm())
            return null;

        const aws_secret_access_key = '3Tb2qswQeoB31bMjlbM0OS1FEX0uEgzCF66LEbfK'
        const aws_access_key_id = 'AKIAI3G26HX46HETLCJQ'

        let creds = new AWS.Credentials(aws_access_key_id, aws_secret_access_key);
        AWS.config.update({
            region: 'us-west-2',
            credentials: creds
        });

        let address = (this.state.apt ? 'Apt ' + this.state.apt + ', ' : '') + this.state.address;
        let orderText = 'The following information was submitted at ' + new Date() + '\r\n' +
         

            'Contact Information\r\n' +
            'First Name: ' + this.state.firstName + '\r\n' +
            'Last Name: ' + this.state.lastName + '\r\n' +
            'Phone: ' + this.state.phone + '\r\n' +
            'Email: ' + this.state.email + '\r\n' +
            'Address: ' + address + '\r\n\r\n' +

            'Now go add this information!'



        // Create the promise and SES service object
        let subject = 'New Order:';

        let systemEmail = this.createEmail('gregkowalski@hotmail.com', subject, orderText);
        let systemSendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(systemEmail).promise();

        let userEmail = this.createEmail(this.state.email, subject, orderText);
        var userSendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(userEmail).promise();

        return { systemSendPromise, userSendPromise };
    }

    createEmail(toAddress, subject, body) {
        // Create sendEmail params 
        var params = {
            Destination: { /* required */
                // CcAddresses: [
                //   'EMAIL_ADDRESS',
                //   /* more items */
                // ],
                ToAddresses: [
                    toAddress,
                    /* more items */
                ]
            },
            Message: { /* required */
                Body: { /* required */
                    // Html: {
                    //     Charset: "UTF-8",
                    //     Data: "<h3>this is formatted crap, <strong>bro</strong></h3>"
                    // },
                    Text: {
                        Charset: "UTF-8",
                        Data: body
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject
                }
            },
            Source: '"Food Market" <foodmarket@cosmo-test.com>'
            //   ReplyToAddresses: [
            //       'EMAIL_ADDRESS',
            //     /* more items */
            //   ],
        };
        return params;
    }

    

    render() {
        return (
            <div className='wrap'>

                <div className='headscroll'>
                    <div className='head-content'>
                        <div className='head-logo'>
                            <a href="/">
                                <Image style={{ margin: '0 auto' }} height='24px' src='/assets/images/heart.png' />
                            </a>
                            <a href="/" className='link'>
                                <div style={{ fontSize: '1.4em', fontWeight: 'bold' }}>foodcraft</div>
                            </a>
                            <div id="content-desktop" style={{ fontSize: '1.1em', fontWeight: 'bold', marginLeft: '2px' }}>
                                local. homemade. fresh.
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bodywrap'>
            <div>
                <div style={{ width: '90%', margin: '20px auto 0 auto', paddingBottom: '20px', marginTop: '5em' }}>

                   
                    <Message error hidden={!this.state.hasErrors.quantity} header='Invalid Quantity' content='Please select at least 1 unit per order.' icon='exclamation circle' />

                    <Divider />

                    <Form noValidate autoComplete='off'>

                        <Header>Your Information</Header>
                        <Form.Group widths='equal'>
                            <Form.Field required error={this.state.hasErrors.firstName}>
                                <label>First name</label>
                                <Input name='firstName' placeholder='First name' onChange={this.handleContactInfoChange} onBlur={this.handleContactInfoBlur} />
                                <Message error visible={this.state.hasErrors.firstName} header='Invalid first name' content='Please enter your first name' icon='exclamation circle' />
                            </Form.Field>
                            <Form.Field required error={this.state.hasErrors.lastName}>
                                <label>Last name</label>
                                <Input name='lastName' placeholder='Last name' onChange={this.handleContactInfoChange} onBlur={this.handleContactInfoBlur} />
                                <Message error visible={this.state.hasErrors.lastName} header='Invalid last name' content='Please enter your last name' icon='exclamation circle' />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Field required error={this.state.hasErrors.phone}>
                                <label>Phone</label>
                                <Input required name='phone' type='tel' placeholder='Phone' onChange={this.handlePhoneNumberChange} onBlur={this.handleContactInfoBlur} />
                                <Message error visible={this.state.hasErrors.phone} header='Invalid phone number' content='Please enter your phone number' icon='exclamation circle' />
                            </Form.Field>

                            <Form.Field required error={this.state.hasErrors.email}>
                                <label>Email</label>
                                <Input required name='email' type='email' placeholder='Email' onChange={this.handleContactInfoChange} onBlur={this.handleContactInfoBlur} />
                                <Message error visible={this.state.hasErrors.email} header='Invalid email' content='Please enter your email address' icon='exclamation circle' />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Field required error={this.state.hasErrors.address}>
                                <label>Street Address</label>
                                <Autocomplete className="order-address"
                                    name='address'
                                    onPlaceSelected={(place) => this.handleAddressChange(place)}
                                    onChange={this.handleContactInfoChange}
                                    onBlur={this.handleContactInfoBlur}
                                    types={['address']}
                                    placeholder='Address'
                                    componentRestrictions={{ country: 'ca' }} />
                                <Message error visible={this.state.hasErrors.address} header='Invalid address' content='Please enter your address' icon='exclamation circle' />
                            </Form.Field>
                            <Form.Input name='apt' label='Apartment' placeholder='Apartment' onChange={this.handleContactInfoChange} onBlur={this.handleContactInfoBlur} />
                        </Form.Group>
                        <Form.Group widths='equal'>

                            

                        </Form.Group>

                        <Divider />

                        
                        <Divider />

                        <OrderFormButton
                            style={{ marginTop: '20px', height: '4em' }} fluid color='black'
                            disabled={!this.state.acceptedTerms}
                            onClick={() => this.handleOrderButtonClick()}>
                            Confirm food entry
                        </OrderFormButton>
                    </Form >
                </div>
            </div>
            </div>
            </div>
        )
    }
}

class OrderFormButton extends React.Component {
    render() {

        const successLink = "orderSuccess";
        const errorLink = "orderError"
        return (
            <Route render={({ history }) => {
                let props = Object.assign({}, this.props);
                delete props.successLink;
                delete props.errorLink;
                delete props.onClick;
                return (
                    <Form.Button {...props}
                        onClick={(e) => {

                            let promises = this.props.onClick(e);
                            if (!promises)
                                return;

                            let { systemSendPromise, userSendPromise } = promises;
                            systemSendPromise
                                .then(result1 => {
                                    console.log(`system email sent: ${result1.MessageId}`);

                                    userSendPromise
                                        .then(result2 => {
                                            console.log(`user email sent: ${result2.MessageId}`);
                                            history.push(`${successLink}?sentCount=2`);
                                        })
                                        .catch(err2 => {
                                            console.error(err2, err2.stack);
                                            history.push(`${successLink}?sentCount=1`);
                                        })
                                }).catch(err1 => {
                                    console.error(err1, err1.stack);
                                    history.push(errorLink);
                                });
                        }}>
                        {this.props.children}
                    </Form.Button>
                )
            }}
            />
        )
    }
}