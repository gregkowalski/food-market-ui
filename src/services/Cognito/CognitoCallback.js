import React from 'react'
import { Redirect } from 'react-router-dom'
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';
import jwtDecode from 'jwt-decode'
import CognitoUtil from './CognitoUtil'
import Util from '../Util'
import ApiClient from '../ApiClient'

export default class CognitoCallback extends React.Component {

    state = {};

    componentWillMount() {
        var auth = new CognitoAuth(CognitoUtil.getCognitoAuthData());
        auth.userhandler = {
            onSuccess: session => {
                console.log('Login success');
                const jwtToken = session.getIdToken().getJwtToken();
                const jwt = jwtDecode(jwtToken);
                let user = {
                    user_id: jwt.sub,
                    idp_name: jwt['custom:idp:name'],
                    email: jwt.email,
                    email_verified: CognitoUtil.isEmailVerified(jwt)
                };
                ApiClient.updateUser(jwtToken, user)
                    .then(x => {
                        let lastPathname = CognitoUtil.getLastPathname();
                        if (!lastPathname) {
                            lastPathname = '/';
                        }
                        this.setState({ redirectTo: lastPathname });
                    })
                    .catch(err => {
                        console.error(err);
                    });
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
        return <div>Logging in...</div>;
    }
}