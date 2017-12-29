import React from 'react'
import AppHeader from './components/AppHeader'
import CognitoUtil from './CognitoUtil'
import jwtDecode from 'jwt-decode'
import { Redirect } from 'react-router-dom'
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';
import { Segment, Input, Form, Button, Image } from 'semantic-ui-react'
import './Profile.css'
import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';

export default class Profile extends React.Component {

    state = {
        hasChanges: false
    };

    componentWillMount() {
        let auth = new CognitoAuth(CognitoUtil.getCognitoAuthData());
        let session = auth.getCachedSession();
        if (session && session.isValid()) {
            const jwt = jwtDecode(session.getIdToken().getJwtToken());
            let newState = {
                jwt: jwt,
                preferred_username: jwt.preferred_username,
                email: jwt.email,
                custom_stripeAccountId: jwt['custom:stripeAccountId']
            };
            this.setState(newState);
        }
    }

    handleChange(e) {
        let oldValue;
        if (this.state.jwt.hasOwnProperty(e.target.name)) {
            oldValue = this.state.jwt[e.target.name];
        }
        let newValue = e.target.value;
        if (oldValue !== newValue) {
            let newState = {
                hasChanges: true
            };
            newState[e.target.name] = e.target.value;
            this.setState(newState);
        }
    }

    handleBlur(e) {

    }

    handleSave(e) {
        if (!this.state.hasChanges) {
            return;
        }

        let attributeList = [];
        if (this.state.jwt.preferred_username !== this.state.preferred_username) {
            let attribute = {
                Name: 'preferred_username',
                Value: this.state.preferred_username
            };
            attributeList.push(new CognitoUserAttribute(attribute));
        }

        if (this.state.jwt.custom_stripeAccountId !== this.state.custom_stripeAccountId) {
            let attribute = {
                Name: 'custom:stripeAccountId',
                Value: this.state.custom_stripeAccountId
            };
            attributeList.push(new CognitoUserAttribute(attribute));
        }

        if (attributeList.length <= 0) {
            return;
        }

        var userPool = new CognitoUserPool(CognitoUtil.getUserPoolData());
        var cognitoUser = userPool.getCurrentUser();
        if (!cognitoUser) {
            console.error('current user is empty');
            return;
        }

        cognitoUser.getSession((err, session) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('session validity: ' + session.isValid());

            cognitoUser.updateAttributes(attributeList, (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('call result: ' + result);

                let newJwt = Object.assign({}, this.state.jwt);
                newJwt.email = this.state.email;
                newJwt.preferred_username = this.state.preferred_username;
                let newState = {
                    jwt: newJwt,
                    hasChanges: false
                };
                this.setState(newState);
            });
        });
    }

    render() {
        if (!this.state.jwt) {
            return <Redirect to='/' />
        }

        let stripeComponent;
        if (this.state.custom_stripeAccountId) {
            stripeComponent =
                <div>
                    <div style={{ marginBottom: '10px' }}>You are ready to be a foodcraft vendor!!!</div>
                    <Image height='100px' src='/assets/images/stripe-logo-blue.png' />
                </div>
        }
        else {
            const stripeClientId = 'ca_C2ECxvqWXaiTNmA44vVjfx2clgV7OexY';
            const stripeState = 'some-random-shit';
            let stripeConnectUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${stripeClientId}&scope=read_write&state=${stripeState}`;
            stripeComponent =
                <div>
                    <div style={{ marginBottom: '10px' }}>If you'd like to become a food vendor and make money with Foodcraft, please create/link a Stripe account.</div>
                    <a href={stripeConnectUrl}>
                        <Image src='/assets/images/stripe-blue-on-light.png' />
                    </a>
                </div>
        }
        return (
            <div>
                <AppHeader />
                <div style={{ width: '80%', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto' }}>
                    <Segment>
                        <Form noValidate autoComplete='off'>
                            <Form.Field>
                                <label>Email</label>
                                <Input readOnly className='profile-email-input' name='email' value={this.state.email} />
                                {/* <Message error visible={this.state.hasErrors.email} header='Invalid email' content='Please enter your email address' icon='exclamation circle' /> */}
                            </Form.Field>
                            {/* <Form.Field required error={this.state.hasErrors.phone}> */}
                            <Form.Field required>
                                <label>Username</label>
                                <Input required name='preferred_username' value={this.state.preferred_username} onChange={(e) => this.handleChange(e)} onBlur={(e) => this.handleBlur(e)} />
                                {/* <Message error visible={this.state.hasErrors.phone} header='Invalid phone number' content='Please enter your phone number' icon='exclamation circle' /> */}
                            </Form.Field>
                            <Form.Field required>
                                <label>Stripe Account Id</label>
                                <Input required name='custom_stripeAccountId' value={this.state.custom_stripeAccountId} onChange={(e) => this.handleChange(e)} onBlur={(e) => this.handleBlur(e)} />
                            </Form.Field>
                            <Button disabled={!this.state.hasChanges} color='teal' type='submit' onClick={(e) => this.handleSave(e)}>Save Changes</Button>
                        </Form>
                    </Segment>
                    <Segment>
                        {stripeComponent}
                    </Segment>
                </div>
            </div>
        );
    }
}
