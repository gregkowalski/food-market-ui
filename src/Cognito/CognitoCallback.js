import React from 'react'
import { Redirect } from 'react-router-dom'
import CognitoUtil from './CognitoUtil'
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';
import Util from '../Util'

export default class CognitoCallback extends React.Component {

    state = {};

    componentWillMount() {
        var auth = new CognitoAuth(CognitoUtil.getCognitoAuthData());
        auth.userhandler = {
            onSuccess: result => {
                console.log('Login success');
                const lastPathname = CognitoUtil.getLastPathname();
                this.setState({ redirectTo: lastPathname });
            },
            onFailure: err => {
                console.error('Login failed: ' + err);
            }
        };

        let query = Util.parseQueryString(window.location);
        if (!query.state) {
            throw new Error('SECURITY ALERT: CSRF state parameter is missing');
        }

        let storedState = CognitoUtil.getCsrfState();
        if (query.state !== storedState) {
            throw new Error('SECURITY ALERT: CSRF state parameter is invalid');
        }

        auth.parseCognitoWebResponse(window.location.href);
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
        console.error('No redirect path');
        return <div></div>;
    }
}