import React from 'react'
import { connect } from 'react-redux'
import CognitoUtil from './services/Cognito/CognitoUtil'
import { Actions, Selectors } from './store/currentUser'
import ErrorCodes from './services/ErrorCodes';

export default function (ComposedClass) {

    class AuthenticatedComponent extends React.Component {

        componentWillMount() {
            if (!CognitoUtil.isLoggedIn()) {
                CognitoUtil.setLastPath(window.location.pathname);
                CognitoUtil.redirectToLogin();
                return;
            }

            this.props.loadCurrentUser();
        }

        componentWillReceiveProps(nextProps) {
            const { errorCode } = nextProps;
            if (errorCode === ErrorCodes.USER_DOES_NOT_EXIST) {
                CognitoUtil.setLastPath(window.location.pathname);
                CognitoUtil.logOut();
                CognitoUtil.redirectToLoginIfNoSession();
                return;
            }
        }

        render() {
            if (!CognitoUtil.isLoggedIn()) {
                return null;
            }

            const { errorCode, ...props } = this.props;
            if (errorCode === ErrorCodes.USER_DOES_NOT_EXIST) {
                return null;
            }

            return <ComposedClass {...props} />
        }
    }

    const mapStateToProps = (state) => {
        return {
            errorCode: Selectors.errorCode(state),
        };
    };

    const mapDispatchToProps = (dispatch) => {
        return {
            loadCurrentUser: () => dispatch(Actions.loadCurrentUser()),
        };
    };

    return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent);
}
