import React from 'react'
import { withRouter } from 'react-router-dom'
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';
import jwtDecode from 'jwt-decode'
import { Image } from 'semantic-ui-react'
import './CognitoCallback.css'
import CognitoUtil from './CognitoUtil'
import Util from '../Util'
import ApiClient from '../ApiClient'
import Config from '../../Config'
import { Constants } from '../../Constants'
import ErrorCodes from '../ErrorCodes'
import LoadingIcon from '../../components/LoadingIcon'
import Url from '../../services/Url'

const Errors = {
    INVALID_PATH: 'INVALID_PATH'
};

class CognitoCallback extends React.Component {

    state = {};
    signingOut = false;

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
                ApiClient.updateUser(user)
                    .then(x => {
                        let lastPath = CognitoUtil.getLastPath();
                        if (!lastPath) {
                            lastPath = Url.home();
                        }
                        if (lastPath.length > 0 && lastPath[0] === '/') {
                            this.props.history.push(lastPath);
                        }
                        else {
                            console.error('Invalid redirect path: ' + lastPath);
                            this.setState({ errorCode: Errors.INVALID_PATH });
                        }
                    })
                    .catch(err => {
                        console.error(err);
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
            this.signOut();
            throw new Error('SECURITY ALERT: CSRF state parameter is missing');
        }

        let storedState = CognitoUtil.getCsrfState();
        if (query.state !== storedState) {
            this.signOut();
            throw new Error('SECURITY ALERT: CSRF state parameter is invalid');
        }

        auth.parseCognitoWebResponse(window.location.href);
    }

    signOut() {
        if (this.signingOut) {
            return;
        }

        setTimeout(() => {
            CognitoUtil.logOut()
        }, 5000);
        this.signingOut = true;
    }

    render() {
        let content;

        const { errorCode } = this.state;
        if (errorCode) {
            let message;
            if (errorCode === Errors.INVALID_PATH) {
                message = 'Invalid landing page';
            }
            else if (errorCode === ErrorCodes.USER_DOES_NOT_EXIST) {
                message = `Foodcraft is a private, invite-only network at this time.  Please contact ${Config.Foodcraft.SupportEmail} for more information`;
            }
            else {
                message = `Something went wrong, error code: ${errorCode}`;
            }
            this.signOut();
            content = (
                <div style={{ margin: 20 }}>
                    {message}
                </div>
            );
        }
        else {
            content = (
                <div className='cognitocallback-loadingicon'>
                    <LoadingIcon size='large' text='Logging in...' />
                </div>
            );
        }

        return (
            <div>
                <div className='cognitocallback-logo'>
                    <Image src={Constants.AppLogo} />
                    <div>{Constants.AppName}</div>
                </div>
                {content}
            </div>
        );
    }
}

export default withRouter(CognitoCallback);