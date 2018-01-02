import React from 'react'
import { Redirect } from 'react-router-dom'
import CognitoUtil from '../Cognito/CognitoUtil'
import apigClientFactory from 'aws-api-gateway-client'
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';
import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import Util from '../Util'
import StripeUtil from './StripeUtil'

export default class StripeCallback extends React.Component {

    state = {};

    saveStripeAccountId(stripeAccountId) {
        let attributeList = [];
        let attribute = {
            Name: 'custom:stripeAccountId',
            Value: stripeAccountId
        };
        attributeList.push(new CognitoUserAttribute(attribute));

        var userPool = new CognitoUserPool(CognitoUtil.getUserPoolData());
        var cognitoUser = userPool.getCurrentUser();
        if (!cognitoUser) {
            throw new Error('current user is empty');
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

                const lastPathname = CognitoUtil.getLastPathname();
                console.log(`lastPathname=${lastPathname}`);

                this.setState({ redirectTo: lastPathname });
            });
        });
    }

    componentWillMount() {

        let query = Util.parseQueryString(window.location);
        if (!query.state) {
            throw new Error('SECURITY ALERT: CSRF state parameter is missing');
        }

        let storedState = StripeUtil.getCsrfState();
        if (query.state !== storedState) {
            throw new Error('SECURITY ALERT: CSRF state parameter is invalid');
        }

        if (!query.code) {
            throw new Error('Not working, code not found: ' + query.error);
        }

        var config = {
            region: 'us-west-2',
            invokeUrl: 'https://be.cosmo-test.com/v1'
        };
        let apigClient = apigClientFactory.newClient(config);

        let auth = new CognitoAuth(CognitoUtil.getCognitoAuthData());
        let session = auth.getCachedSession();
        if (session && session.isValid()) {
            let body = {
                code: query.code
            }
            var additionalParams = {
                headers: {
                    'X-FOOD-MARKET-JWT': session.getIdToken().getJwtToken(),
                    'Content-Type': 'application/json'
                },
            };

            apigClient.invokeApi(null, '/stripeconnect', 'POST', additionalParams, body)
                .then(response => {
                    console.log('Call API success!!!');
                    console.log(JSON.stringify(response.data));

                    let data = JSON.parse(response.data);
                    console.log(data.stripeAccountId);

                    this.saveStripeAccountId(data.stripe_user_id);

                }).catch(result => {
                    //This is where you would put an error callback
                    console.error('Call API failed!!!');
                    console.log(JSON.stringify(result));
                });
        }
    }

    render() {
        if (this.state.redirectTo) {
            // verify redirect link starts with a / to ensure we're not redirecting to another site
            if (this.state.redirectTo.length > 0 && this.state.redirectTo[0] === '/') {
                return <Redirect to={this.state.redirectTo} />
            }
            console.error('Invalid redirect path');
            return <div></div>;
        }
        return <div>Please wait, we are connecting your Foodcraft and Stripe accounts...</div>;
    }
}