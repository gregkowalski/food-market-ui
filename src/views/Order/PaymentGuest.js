import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'formik'
import { Icon, Button, Input, Message } from 'semantic-ui-react'
import './PaymentGuest.css'
import PortionUpButton from './PortionUpButton'
import PortionDownButton from './PortionDownButton'

export default class PaymentGuest extends React.Component {

    handleEmailRemove = () => {
        const { onEmailRemove, index } = this.props;
        if (onEmailRemove) {
            onEmailRemove(index);
        }
    }

    render() {
        const { index } = this.props;

        return (
            <div className='payguest'>
                <div className='payguest-email'>
                    <Field name={`payGuests.${index}.email`} render={this.renderEmail} />
                </div>
                <div className='payguest-portion'>
                    <div>
                        <Field name={`payGuests.${index}.portion`} render={({ field, form }) => {
                            const down = () => {
                                if (field.value > 1) {
                                    form.setFieldValue(`payGuests.${index}.portion`, field.value - 1);
                                }
                            }

                            const up = () => {
                                if (field.value < 9) {
                                    form.setFieldValue(`payGuests.${index}.portion`, field.value + 1);
                                }
                            }

                            return (
                                <div className='payguest-portion-selector'>
                                    {/* an empty onTouchStart causes :active to work on mobile iOS */}
                                    <PortionDownButton onClick={down} portion={field.value} />
                                    <div className='payguest-portion-num'>{field.value}</div>
                                    <PortionUpButton onClick={up} portion={field.value} />
                                </div>
                            );
                        }} />
                        <Field name={`payGuests.${index}.amount`} render={({ field }) => {
                            return (
                                <div className='payguest-price'>${field.value.toFixed(2)}</div>
                            );
                        }} />
                    </div>
                </div>
            </div>
        );
    }

    renderEmail = ({ field, form: { touched, errors } }) => {

        const { index } = this.props;

        const action = index > 0 && (
            <Button icon onClick={this.handleEmailRemove} basic>
                <Icon name='remove' color='grey' />
            </Button>
        );

        const parts = field.name.split('.');
        let isTouched = touched;
        for (let i = 0; i < parts.length && isTouched; i++) {
            isTouched = isTouched[parts[i]];
        }
        const error = errors[field.name];
        const inputProps = {};
        if (isTouched && error) {
            inputProps.error = true;
        }

        return (
            <div className='validatedfield'>
                <Input
                    {...field}
                    {...inputProps}
                    type='text'
                    placeholder="Enter foodcraft user's email..."
                    action={action} />
                {isTouched && error &&
                    <Message error content={error.message} icon='exclamation circle' />
                }
            </div>
        );
    }
}

PaymentGuest.propTypes = {
    payGuest: PropTypes.shape({
        email: PropTypes.string.isRequired,
        portion: PropTypes.number.isRequired,
        amount: PropTypes.number.isRequired,
    }),
}
