import React from 'react'
import { Redirect } from 'react-router-dom'
import CognitoUtil from './CognitoUtil'
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';
import queryString from 'query-string'

export default class CognitoCallback extends React.Component {

    state = {};

    parseQueryString(location) {
        let query = location.search
        if (!query) {
            query = location.hash;
        }
        if (query && (query[0] === '#' || query[0] === '?')) {
            query = query.substring(1);
        }
        return queryString.parse(query);
    }

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

        let query = this.parseQueryString(window.location);
        if (!query.state) {
            console.error('SECURITY ALERT: CSRF state parameter is missing');
            return;
        }

        let storedState = CognitoUtil.getCsrfState();
        if (query.state !== storedState) {
            console.error('SECURITY ALERT: CSRF state parameter is invalid');
            return;
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