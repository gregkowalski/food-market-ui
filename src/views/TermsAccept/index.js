import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Actions, Selectors } from '../../store/currentUser'
import { withRouter } from 'react-router-dom'
import { Button, Message } from 'semantic-ui-react'
import './index.css'
import AppHeader from '../../components/AppHeader'
import Url from '../../services/Url'
import CognitoUtil from '../../services/Cognito/CognitoUtil';

class TermsAccept extends React.Component {

    state = {};

    componentDidMount() {
        const { user, history } = this.props;
        if (user && user.terms_accepted) {
            history.push(Url.home());
            return;
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.termsAccepted && nextProps.termsAccepted) {
            this.props.history.push(Url.home());
            return;
        }

        if (this.props.isSaving && !nextProps.isSaving) {

            // We finished saving, let's set the appropriate success or error messages
            if (nextProps.apiError) {
                console.log(nextProps.apiError);
                this.setState({ message: { show: true, content: `Unable to accept terms at this time, please try again later. Error: ${nextProps.apiError}` } });
            }
            else {
                this.setState({ message: { show: false } });
            }
        }
    }

    handleAccept = () => {
        this.props.actions.acceptTerms(this.props.user.user_id);
    }

    handleCancel = () => {
        CognitoUtil.logOut();
        CognitoUtil.redirectToLogin();
    }

    render() {
        const { isSaving } = this.props;
        const { message } = this.state;

        return (
            <div>
                <AppHeader />
                <div>These are the terms</div>
                <Button loading={isSaving} onClick={this.handleAccept}>Accept</Button>
                <Button onClick={this.handleCancel}>Cancel</Button>
                {message && message.show &&
                    <Message error header='Error' content={message.content} icon='exclamation circle' />
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: Selectors.currentUser(state),
        isSaving: Selectors.isSaving(state),
        termsAccepted: Selectors.termsAccepted(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};

TermsAccept.propTypes = {
    user: PropTypes.object,
    termsAccepted: PropTypes.bool,

    actions: PropTypes.shape({
        acceptTerms: PropTypes.func.isRequired,
    }).isRequired
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TermsAccept));