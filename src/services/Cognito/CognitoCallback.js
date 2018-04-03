import React from 'react'
import { Redirect } from 'react-router-dom'
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';
import jwtDecode from 'jwt-decode'
import { Image } from 'semantic-ui-react'
import './CognitoCallback.css'
import CognitoUtil from './CognitoUtil'
import Util from '../Util'
import ApiClient from '../ApiClient'
import Config from '../../Config'
import Constants from '../../Constants'
import ErrorCodes from '../ErrorCodes'
import LoadingIcon from '../../components/LoadingIcon'

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
                        let lastPath = CognitoUtil.getLastPath();
                        if (!lastPath) {
                            lastPath = '/';
                        }
                        this.setState({ redirectTo: lastPath });
                    })
                    .catch(err => {
                        console.error(err);
                        CognitoUtil.logOut();
                        if (err.response && err.response.data) {
                            this.setState({ errorCode: err.response.data.code });
                        }
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
        const { errorCode, redirectTo } = this.state;
        if (redirectTo) {
            // verify redirect link starts with a / to ensure we're not redirecting to another site
            if (redirectTo.length > 0 && redirectTo[0] === '/') {
                return <Redirect to={redirectTo} />
            }
            console.error('Invalid redirect path');
            return <div></div>;
        }
        else if (errorCode === ErrorCodes.USER_DOES_NOT_EXIST) {
            return <div>Foodcraft is a private, invite-only network at this time.  Please contact {Config.Foodcraft.SupportEmail} for more information</div>
        }

        return (
            <div>
                <div className='cognitocallback-logo'>
                    <Image src={Constants.AppLogo} />
                    <div>{Constants.AppName}</div>
                </div>
                <div className='cognitocallback-loadingicon'>
                    <LoadingIcon size='large' text='Logging in...' />
                </div>
            </div>
        );
    }
}