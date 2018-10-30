import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Input, Button, Message, Image } from 'semantic-ui-react';
import './ConfirmEmail.css'
import { Actions, Selectors } from '../../store/admin'
import Util from '../../services/Util'
import CognitoUtil from '../../services/Cognito/CognitoUtil'
import aws_cognito_banner from './aws_cognito_banner.png'

class ConfirmEmail extends React.Component {

    state = { code: '', header: '', content: '', show: false, isError: false };

    componentWillMount() {
        const { acceptInviteResult } = this.props;
        if (!acceptInviteResult) {
            CognitoUtil.redirectToLogin();
        }
    }

    handleVerifyCode = () => {
        const { code } = this.state;
        this.props.actions.confirmCode(code);
    }

    handleResendCode = () => {
        this.props.actions.resendCode();
    }

    handleChangeCode = (event, data) => {
        this.setState({ code: data.value });
        this.props.actions.hideResult();
    }

    handleCodeKeyPress = (e) => {
        const EnterKeyCode = 13;
        const key = e.which || e.keyCode;
        if (key === EnterKeyCode) {
            e.preventDefault(); // prevent the form from being submitted
            this.handleVerifyCode();
        }
    }

    render() {
        const { code } = this.state;
        const { acceptInviteResult, result, isConfirmingCode, isResendingCode } = this.props;
        const { header, content, show, isError } = result || {};

        if (!acceptInviteResult)
            return null;

        const email = Util.sanitizeEmail(acceptInviteResult.email);

        return (
            <div className='confirmemail'>
                <div className='confirmemail-body'>
                    <div className='confirmemail-banner'>
                        <Image src={aws_cognito_banner} />
                    </div>
                    <div className='confirmemail-content'>
                        <p>We have sent a code by email to {email}.  Enter it below to confirm your account.</p>
                        <form>
                            <span>Verification Code</span>
                            <Input type='password' autoComplete='new-password' value={code} onChange={this.handleChangeCode} onKeyPress={this.handleCodeKeyPress} />
                        </form>
                        <Button fluid color='purple' loading={isConfirmingCode} onClick={this.handleVerifyCode}>Confirm Account</Button>
                        <div>
                            <span>Didn't receive a code?</span>
                            <Button id='confirmemail-resend' loading={isResendingCode} onClick={this.handleResendCode}>Resend it</Button>
                        </div>
                        {show &&
                            <Message error={isError} success={!isError} header={header} content={content} />
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        acceptInviteResult: Selectors.acceptInviteResult(state),
        isConfirmingCode: Selectors.isConfirmingCode(state),
        isResendingCode: Selectors.isResendingCode(state),
        result: Selectors.result(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};

ConfirmEmail.propTypes = {
    acceptInviteResult: PropTypes.shape({
        code: PropTypes.string.isRequired,
        first_time: PropTypes.bool.isRequired,
        user_status: PropTypes.string,
        email: PropTypes.string.isRequired,
    }),

    isConfirmingCode: PropTypes.bool.isRequired,
    isResendingCode: PropTypes.bool.isRequired,

    result: PropTypes.shape({
        header: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        show: PropTypes.bool.isRequired,
        isError: PropTypes.bool.isRequired,
    }),

    actions: PropTypes.shape({
        acceptInvite: PropTypes.func.isRequired,
        confirmCode: PropTypes.func.isRequired,
        resendCode: PropTypes.func.isRequired,
        hideResult: PropTypes.func.isRequired,
    }).isRequired
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ConfirmEmail));
