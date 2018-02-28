import React from 'react'
import { Redirect } from 'react-router-dom'
import CognitoUtil from '../services/Cognito/CognitoUtil'

export default class Login extends React.Component {

    state = {};

    componentWillMount() {
        if (!CognitoUtil.isLoggedIn()) {
            CognitoUtil.redirectToLogin();
        }
        else {
            this.setState({ isLoggedIn: true });
        }
    }

    render() {
        if (this.state.isLoggedIn) {
            return <Redirect to='/' />
        }
        return <div></div>;
    }
}
