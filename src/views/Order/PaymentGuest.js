import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Actions, Selectors } from '../../store/order'
import { Selectors as CurrentUserSelectors } from '../../store/currentUser'
import { Field } from 'redux-form'
import { Icon, Button } from 'semantic-ui-react'
import './PaymentGuest.css'
import { ValidatedField } from '../../components/Validation'

export default class PaymentGuest extends React.Component {

    handleEmailChange = (event, { value }) => {
        const { onEmailChange, index } = this.props;
        if (onEmailChange) {
            onEmailChange(index, value);
        }
    }

    handleEmailRemove = () => {
        const { onEmailRemove, index } = this.props;
        if (onEmailRemove) {
            onEmailRemove(index);
        }
    }

    handlePortionDown = () => {
        const { onPortionDown, index } = this.props;
        if (onPortionDown) {
            onPortionDown(index);
        }
    }

    handlePortionUp = () => {
        const { onPortionUp, index } = this.props;
        if (onPortionUp) {
            onPortionUp(index);
        }
    }

    upButtonProps = (portion) => {
        if (portion < 9) {
            return { color: 'purple' };
        }
        return { color: 'black', disabled: true };
    }

    downButtonProps = (portion) => {
        if (portion > 1) {
            return { color: 'purple' };
        }
        return { color: 'black', disabled: true };
    }

    handleEmailChange = (event, data) => {
        const { index, onEmailChange } = this.props;

        if (onEmailChange) {
            onEmailChange(index, data.value);
        }
    }

    render() {
        const { index, amount, portion, onEmailRemove, onEmailChange, isCurrentUser, email } = this.props;

        const action = onEmailRemove && index > 0 && (
            <Button icon onClick={this.handleEmailRemove} basic>
                <Icon name='remove' color='grey' />
            </Button>
        );

        return (
            <div className='payguest'>
                <div className='payguest-email'>
                    {isCurrentUser &&
                        // <Input value={email} disabled={!onEmailChange} />
                        <div className='payguest-header'>{email}</div>
                    }
                    {!isCurrentUser &&
                        <Field
                            name={'email-' + index}
                            type='text'
                            component={ValidatedField}
                            disabled={!onEmailChange}
                            autoComplete={'email-' + index}
                            placeholder="Enter foodcraft user's email..."
                            action={action}
                            onChangeIntercept={this.handleEmailChange}
                        />
                    }
                </div>
                <div className='payguest-portion'>
                    <div>
                        <div className='payguest-portion-selector'>
                            {/* an empty onTouchStart causes :active to work on mobile iOS */}
                            <Button basic circular icon='minus' {...this.downButtonProps(portion)}
                                onClick={this.handlePortionDown} onTouchStart={() => { }} />
                            <div className='payguest-portion-num'>{portion}</div>
                            <Button basic circular icon='plus' {...this.upButtonProps(portion)}
                                onClick={this.handlePortionUp} onTouchStart={() => { }} />
                        </div>
                        <div className='payguest-price'>${amount.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        );
    }
}