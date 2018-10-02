import React from 'react'
import { connect } from 'react-redux'
import CognitoUtil from '../services/Cognito/CognitoUtil'
import { Actions, Selectors } from '../store/currentUser'
import ErrorCodes from '../services/ErrorCodes';
import Url from '../services/Url'

export default function (ComposedClass, options = {}) {

    class AuthenticatedComponent extends React.Component {

        componentWillMount() {
            if (!CognitoUtil.isLoggedIn()) {
                CognitoUtil.setLastPath(window.location.pathname);
                CognitoUtil.redirectToLogin();
                return;
            }

            this.props.loadCurrentUser();
        }

        componentDidMount() {
            const { user } = this.props;
            if (user && !user.terms_accepted && !options.skipTermsAccepted) {
                Url.open(Url.termsAccept());
                return;
            }
        }

        componentWillReceiveProps(nextProps) {
            const { apiErrorCode } = nextProps;
            if (apiErrorCode === ErrorCodes.USER_DOES_NOT_EXIST) {
                CognitoUtil.setLastPath(window.location.pathname);
                CognitoUtil.logOut();
                CognitoUtil.redirectToLoginIfNoSession();
                return;
            }

            if (!this.props.user && nextProps.user && !nextProps.user.terms_accepted && !options.skipTermsAccepted) {
                Url.open(Url.termsAccept());
                return;
            }
        }

        render() {
            if (!CognitoUtil.isLoggedIn()) {
                return null;
            }

            const { apiErrorCode, user, ...props } = this.props;
            if (apiErrorCode === ErrorCodes.USER_DOES_NOT_EXIST) {
                return null;
            }

            if (!user || (!user.terms_accepted && !options.skipTermsAccepted)) {
                return null;
            }

            return <ComposedClass {...props} />
        }
    }

    const mapStateToProps = (state) => {
        return {
            apiErrorCode: Selectors.apiErrorCode(state),
            user: Selectors.currentUser(state)
        };
    };

    const mapDispatchToProps = (dispatch) => {
        return {
            loadCurrentUser: () => dispatch(Actions.loadCurrentUser()),
        };
    };

    return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent);
}
