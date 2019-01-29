import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Actions, Selectors } from '../../store/currentUser'
import { withRouter } from 'react-router-dom'
import { Button, Checkbox } from 'semantic-ui-react'
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

    handleAccept = () => {
        this.props.actions.acceptTerms();
    }

    handleDecline = () => {
        CognitoUtil.logOut();
        CognitoUtil.redirectToLogin();
    }

    changeCheckbox = () => {
        this.setState({ checkedTerms: !this.state.checkedTerms });
    }

    render() {
        const { isAcceptingTerms } = this.props;
        const { checkedTerms } = this.state;

        return (
            <div className='termsaccept'>
                <AppHeader fixed />
                <div className='termsaccept-header'>Foodcraft Terms of Use and Privacy Policy</div>
                <Checkbox checked={checkedTerms} onChange={this.changeCheckbox} label={<label>Check here to indicate that you have read and agree to the <a target='_blank' rel='noopener noreferrer' href='/terms'>Foodcraft Terms of Use</a> and <a target='_blank' rel='noopener noreferrer' href='/privacy'>Privacy Policy</a></label>} />
                <div className='termsaccept-button'>
                    <Button id='termsaccept-button-cancel' onClick={this.handleDecline}>Decline</Button>
                    <Button id='termsaccept-button-accept' disabled={!checkedTerms} loading={isAcceptingTerms} onClick={this.handleAccept}>Accept</Button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: Selectors.currentUser(state),
        isAcceptingTerms: Selectors.isAcceptingTerms(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};

TermsAccept.propTypes = {
    user: PropTypes.object,
    isAcceptingTerms: PropTypes.bool,

    actions: PropTypes.shape({
        acceptTerms: PropTypes.func.isRequired,
    }).isRequired
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TermsAccept));