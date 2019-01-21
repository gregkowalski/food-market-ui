import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Segment, Button, Input, Loader } from 'semantic-ui-react'
import './PhoneVerificationComponent.css'
import Util from '../../services/Util'
import { Actions, Selectors } from '../../store/profile'
import { toast } from 'react-toastify'

class PhoneVerificationComponent extends React.Component {

    handleCodeChange = (event, data) => {
        this.props.actions.changeCodeText(data.value);
    }

    handleCodeKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.handleVerifyCodeClick();
        }
    }

    handlePhoneChange = (event, data) => {
        const phone = Util.getAsYouTypePhone(data.value);
        this.props.actions.changePhoneText(phone);
    }

    handlePhoneKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.handleNextClick();
        }
    }

    handleNextClick = () => {
        const { actions, phone } = this.props;
        if (!Util.validatePhoneNumber(phone)) {
            toast.error('Please enter a valid phone number');
            return;
        }
        actions.sendPhoneVerificationCode(phone);
    }

    handleResendCodeClick = () => {
        const { actions, phone } = this.props;
        actions.sendPhoneVerificationCode(phone, true);
    }

    handleVerifyCodeClick = () => {
        const { actions, code } = this.props;
        actions.verifyPhoneVerificationCode(code);
    }

    render() {
        const { showCodeVerificationView, phone, code, isSendingCode, isVerifyingCode } = this.props;
        const allowNext = Util.validatePhoneNumber(phone);

        return (
            <Segment attached className='phoneverify'>
                {!showCodeVerificationView &&
                    <div className='phoneverify-enter-number'>
                        <div>Please enter your phone number</div>
                        <Input value={phone} type='tel' placeholder='+1 604 111 2222' onChange={this.handlePhoneChange} onKeyPress={this.handlePhoneKeyPress} />
                        <Button disabled={!allowNext} loading={isSendingCode} color='purple' onClick={this.handleNextClick}>Next</Button>
                    </div>
                }
                {showCodeVerificationView &&
                    <div className='phoneverify-code'>
                        <div className='phoneverify-code-message'>Please enter 6-digit code sent to: <div>{phone}</div></div>
                        <div className='phoneverify-code-verify'>
                            <Input value={code} type='tel' maxLength={6} onChange={this.handleCodeChange} onKeyPress={this.handleCodeKeyPress}/>
                            <div>
                                <Button color='purple' loading={isVerifyingCode} onClick={this.handleVerifyCodeClick}>Verify Code</Button>
                            </div>
                        </div>
                        <div className='phoneverify-resend'>
                            <span onClick={this.handleResendCodeClick}>Re-send code</span>
                            <Loader inline size='tiny' active={isSendingCode} />
                        </div>
                    </div>
                }
            </Segment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        showCodeVerificationView: Selectors.showCodeVerificationView(state),
        phone: Selectors.phone(state),
        code: Selectors.code(state),
        isSendingCode: Selectors.isSendingCode(state),
        isVerifyingCode: Selectors.isVerifyingCode(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Actions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PhoneVerificationComponent);
