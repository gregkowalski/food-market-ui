import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Actions, Selectors } from '../../store/order'
import { Selectors as CurrentUserSelectors } from '../../store/currentUser'
import { Field } from 'formik'
import { Icon, Button, Input, Message } from 'semantic-ui-react'
import './PaymentGuest.css'

export default class PaymentGuest extends React.Component {

    handleEmailChange = (event, data) => {
        const { index, onEmailChange } = this.props;
        if (onEmailChange) {
            onEmailChange(index, data.value);
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

    render() {
        const { index, amount, portion, onEmailRemove, onEmailChange, isCurrentUser, email } = this.props;

        const action = onEmailRemove && index > 0 && (
            <Button icon onClick={this.handleEmailRemove} basic>
                <Icon name='remove' color='grey' />
            </Button>
        );

        const renderField = ({ field, form: { touched, errors } }) => {
            const payGuest = field.value;
            const fieldWrapper = Object.assign({}, field);
            fieldWrapper.onChange = (event, data) => {
                const fieldData = Object.assign({}, data, {
                    value: Object.assign({}, payGuest, { email: data.value })
                });
                field.onChange(event, fieldData);
                this.handleEmailChange(event, data);
            }
            fieldWrapper.value = payGuest.email;

            return (
                <div className='validatedfield'>
                    <Input
                        {...fieldWrapper}
                        type='text'
                        disabled={!onEmailChange}
                        placeholder="Enter foodcraft user's email..."
                        action={action} />
                    {touched && errors && errors.length > 0 &&
                        <Message error content={errors[field.name]} icon='exclamation circle' />
                    }
                </div>
            );
        }

        return (
            <div className='payguest'>
                <div className='payguest-email'>
                    {isCurrentUser &&
                        // <Input value={email} disabled={!onEmailChange} />
                        <div className='payguest-header'>{email}</div>
                    }
                    {!isCurrentUser &&
                        <Field name={`payGuests.${index}`} render={renderField} />
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