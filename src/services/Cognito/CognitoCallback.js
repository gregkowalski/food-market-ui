import React from 'react'
import { withRouter } from 'react-router-dom'
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';
import CognitoUtil from './CognitoUtil'
import Util from '../Util'
import ErrorCodes from '../ErrorCodes'
import LoadingHeader from '../../components/LoadingHeader'
import Url from '../../services/Url'
import AutoLogoutService from '../../services/AutoLogoutService'

const Errors = {
    INVALID_PATH: 'INVALID_PATH',
    LOGIN_FAILED: 'LOGIN_FAILED',
    CSRF_STATE_EMPTY: 'CSRF_STATE_EMPTY',
    CSRF_STATE_INVALID: 'CSRF_STATE_INVALID',
};

class CognitoCallback extends React.Component {

    state = {};
    signingOut = false;

    componentWillMount() {
        const query = Util.parseQueryString(window.location);
        if (!query.state) {
            this.signOut();
            console.error('SECURITY ALERT: CSRF state parameter is missing');
            this.setState({ errorCode: Errors.CSRF_STATE_EMPTY });
            return;
        }

        const storedState = CognitoUtil.getCsrfState();
        if (query.state !== storedState) {
            this.signOut();
            console.error('SECURITY ALERT: CSRF state parameter is invalid');
            this.setState({ errorCode: Errors.CSRF_STATE_INVALID });
            return;
        }

        if (query.error) {
            this.signOut();
            this.setState({ errorCode: Errors.LOGIN_FAILED, errorMessage: query.error_description });
            return;
        }

        const auth = new CognitoAuth(CognitoUtil.getCognitoAuthData());
        auth.userhandler = {
            onSuccess: () => {
                AutoLogoutService.initSession();

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
            },
            onFailure: err => {
                console.error('Login failed: ' + err);
                this.setState({ errorCode: Errors.LOGIN_FAILED });
            }
        };
        auth.parseCognitoWebResponse(window.location.href);
    }

    signOut() {
        if (this.signingOut) {
            return;
        }

        setTimeout(() => { CognitoUtil.logOut() }, 5000);
        this.signingOut = true;
    }

    getErrorMessage(errorCode) {
        switch (errorCode) {
            case Errors.INVALID_PATH:
                return 'Invalid landing page';

            case ErrorCodes.LOGIN_FAILED:
            case ErrorCodes.CSRF_STATE_EMPTY:
            case ErrorCodes.CSRF_STATE_INVALID:
                return 'Login failed, please try again.  You will be redirected to login page in few seconds.';

            default:
                return `Something went wrong, error code: ${errorCode}`;
        }
    }

    render() {
        let content;

        const { errorCode, errorMessage } = this.state;
        if (errorCode) {
            let message = errorMessage;
            if (!message) {
                message = this.getErrorMessage(errorCode);
            }
            this.signOut();
            content = (
                <div style={{ margin: 20 }}>
                    {message}
                </div>
            );
        }

        return (
            <LoadingHeader>
                {content}
            </LoadingHeader>
        );
    }
}

export default withRouter(CognitoCallback);