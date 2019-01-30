import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Actions, Selectors } from '../../store/admin'
import { Button, Input } from 'semantic-ui-react'
import './InviteUser.css'
import AppHeader from '../../components/AppHeader'
import Util from '../../services/Util'

class Invite extends React.Component {

    state = {
        email: ''
    };

    emailChanged = (e) => {
        const email = e.target.value;
        const isEmailValid = Util.validateEmail(email);
        this.setState({ email, isEmailValid });
    }

    handleSendInvite = () => {
        const { email } = this.state;
        this.props.actions.inviteUser(email);
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
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isInvitingUser: Selectors.isInvitingUser(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};

Invite.propTypes = {
    isInvitingUser: PropTypes.bool,

    actions: PropTypes.shape({
        inviteUser: PropTypes.func.isRequired,
    }).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Invite);