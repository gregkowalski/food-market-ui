import React from 'react'
import { connect } from 'react-redux'
import CognitoUtil from '../services/Cognito/CognitoUtil'
import { Selectors } from '../store/currentUser'
import Url from '../services/Url'

export default function (ComposedClass) {

    class AdminComponent extends React.Component {

        componentDidMount() {
            if (!CognitoUtil.isAdmin()) {
                Url.open(Url.home());
                return;
            }
        }

        render() {
            const { user, ...props } = this.props;
            return <ComposedClass {...props} />
        }
    }

    const mapStateToProps = (state) => {
        return {
            user: Selectors.currentUser(state)
        };
    };

    return connect(mapStateToProps)(AdminComponent);
}
