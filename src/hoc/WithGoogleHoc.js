import React from 'react'
import Config from '../Config'
import { connect } from 'react-redux';
import { Selectors, Actions } from '../store/google'

export default function (ComposedClass) {

    class WithGoogleComponent extends React.Component {

        componentWillMount() {
            const { google, actions } = this.props;
            if (!google) {
                actions.loadGoogleApi(Config.Google.ApiKey);
            }
        }

        render() {
            const { google, actions, ...props } = this.props;
            return <ComposedClass {...props} google={google} />
        }
    }

    const mapStateToProps = (state) => {
        return {
            google: Selectors.google(state),
        };
    };

    const mapDispatchToProps = (dispatch) => {
        return {
            actions: {
                loadGoogleApi: (apiKey) => dispatch(Actions.loadGoogleApi(apiKey)),
            }
        };
    };

    return connect(mapStateToProps, mapDispatchToProps)(WithGoogleComponent);
}
