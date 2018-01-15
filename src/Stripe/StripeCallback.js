import React from 'react'
import { Redirect } from 'react-router-dom'
import CognitoUtil from '../Cognito/CognitoUtil'
import Util from '../Util'
import StripeUtil from './StripeUtil'
import ApiClient from '../Api/ApiClient'

export default class StripeCallback extends React.Component {

    state = {};

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

        let apiClient = new ApiClient();
        apiClient.connectStripeAccount(query.code)
            .then(response => {
                console.log('Stripe account connected');
                const lastPathname = CognitoUtil.getLastPathname();
                console.log(`lastPathname=${lastPathname}`);
                this.setState({ redirectTo: lastPathname });
            })
            .catch(result => {
                //This is where you would put an error callback
                console.error('Call API failed!!!');
                console.log(JSON.stringify(result));
            });
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