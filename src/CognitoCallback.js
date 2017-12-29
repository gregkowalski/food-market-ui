import React from 'react'
import { Redirect } from 'react-router-dom'
import CognitoUtil from './CognitoUtil'
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';

export default class CognitoCallback extends React.Component {

    state = {};

    componentDidMount() {
        var auth = new CognitoAuth(CognitoUtil.getCognitoAuthData());
        auth.userhandler = {
            onSuccess: result => {
                console.log('Login success');
            },
            onFailure: err => {
                console.error('Login failed: ' + err);
            }
        };
        var curUrl = window.location.href;
        auth.parseCognitoWebResponse(curUrl);

        const lastPathname = CognitoUtil.getLastPathname();
        console.log(`lastPathname=${lastPathname}`);

        this.setState({ redirectTo: lastPathname });
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