import React from 'react'
import CognitoUtil from './services/Cognito/CognitoUtil'

export default function (ComposedClass) {

    return class extends React.Component {

        componentWillMount() {

            this.isLoggedIn = CognitoUtil.isLoggedIn();

            if (!this.isLoggedIn) {
                CognitoUtil.setLastPath(window.location.pathname);
                CognitoUtil.redirectToLoginIfNoSession();
            }
        }

        render() {
            if (!this.isLoggedIn) {
                return null;
            }

            return <ComposedClass {...this.props} />
        }
    }
}
