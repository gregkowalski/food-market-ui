import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Actions, Selectors } from '../../store/admin'
import { Button, Message, Input } from 'semantic-ui-react'
import './InviteUser.css'
import AppHeader from '../../components/AppHeader'
import Util from '../../services/Util'
import ErrorCodes from '../../services/ErrorCodes'

class Invite extends React.Component {

    state = {
        email: ''
    };

    emailChanged = (e) => {
        const email = e.target.value;
        const isEmailValid = Util.validateEmail(email);
        this.setState({ email, isEmailValid, showMessage: false });
    }

    handleSendInvite = () => {
        const { email } = this.state;
        this.props.actions.inviteUser(email);
        this.setState({ showMessage: true });
    }

    message() {
        const { isInvitingUser, inviteUserResult } = this.props;
        const { showMessage } = this.state;
        
        if (isInvitingUser || !inviteUserResult || !showMessage) {
            return null;
        }

        let { message, code } = inviteUserResult;
        if (!code) {
            return null;
        }

        const error = (code === ErrorCodes.ERROR);
        if (!error && !message) {
            message = 'User was invited successfully';
        }
        return (<Message error={error} success={!error} header={code} content={message} />);
    }

    render() {
        const { email, isEmailValid } = this.state;
        const { isInvitingUser } = this.props;

        const buttonDisabled = isInvitingUser || !isEmailValid;

        return (
            <div className='inviteuser'>
                <AppHeader fixed />
                <h2>Invite New Foodcraft User</h2>
                <div className='inviteuser-form'>
                    <Input type='email' label='Email' value={email} placeholder='Enter invitee email...' onChange={this.emailChanged} />
                    <Button disabled={buttonDisabled} loading={isInvitingUser} onClick={this.handleSendInvite}>Invite</Button>
                    {this.message()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isInvitingUser: Selectors.isInvitingUser(state),
        inviteUserResult: Selectors.inviteUserResult(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};

Invite.propTypes = {
    isInvitingUser: PropTypes.bool,
    inviteUserResult: PropTypes.shape({
        code: PropTypes.string.isRequired,
        message: PropTypes.string
    }),

    actions: PropTypes.shape({
        inviteUser: PropTypes.func.isRequired,
    }).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Invite);