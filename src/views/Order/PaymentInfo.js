import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Actions, Selectors, PayOptions, EmptyPayGuest } from '../../store/order'
import { Selectors as CurrentUserSelectors } from '../../store/currentUser'
import { Header, Segment, Radio, Icon, Button, Divider, Message } from 'semantic-ui-react'
import './PaymentInfo.css'
import PriceCalc from '../../services/PriceCalc'
import { Colors } from '../../Constants'
import PaymentGuest from './PaymentGuest'
import { FieldArray, Field } from 'formik'
import PortionUpButton from './PortionUpButton'
import PortionDownButton from './PortionDownButton'

class PaymentInfo extends React.Component {

    render() {
        const { food, quantity, pickup, currentUser, form } = this.props;
        if (!food || !currentUser)
            return null;

        const totalAmount = PriceCalc.getTotalPrice(food, quantity, pickup);

        return (
            <MainForm {...form} totalAmount={totalAmount} />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: CurrentUserSelectors.currentUser(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};

PaymentInfo.propTypes = {
    currentUser: PropTypes.object,
    food: PropTypes.shape({
        food_id: PropTypes.string.isRequired,
    }),
    pickup: PropTypes.bool.isRequired,
    quantity: PropTypes.number.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentInfo);

const MainForm = ({ totalAmount, values }) => {

    const { currentUserPayGuest, payOption } = values;
    return (
        <Segment className='payinfo'>
            <Header>How do you want to pay for this order?</Header>
            <PayOptionField name='payOption' totalAmount={totalAmount} userAmount={currentUserPayGuest.amount} />

            {payOption === PayOptions.split &&
                <div className='payinfo-share'>
                    <CurrentUserPaymentField name='currentUserPayGuest' />

                    <Divider />
                    <div className='payinfo-guest-header'>Enter email address(es):</div>
                    <Divider hidden />
                    <PayGuestsFieldArray name='payGuests' payGuests={values.payGuests} />
                </div>
            }
        </Segment>
    );
}

const PayGuestsFieldArray = ({ name, payGuests }) => {
    return (
        <FieldArray name={name} render={(arrayHelpers) => {

            const payGuestsComponentList = payGuests.map((payGuest, index) => {

                const handleEmailRemove = () => {
                    arrayHelpers.remove(index);
                }

                return (
                    <div key={index}>
                        <PaymentGuest
                            index={index}
                            payGuest={payGuest}
                            arrayHelpers={arrayHelpers}
                            onEmailRemove={handleEmailRemove}
                        />
                        {index + 1 < payGuests.length &&
                            <Divider section />
                        }
                    </div>
                );
            });

            const handleEmailAdd = () => {
                arrayHelpers.push(Object.assign({}, EmptyPayGuest));
            }

            return (
                <div>
                    {payGuestsComponentList}

                    <Divider />

                    <div className='payinfo-share-add'>
                        {/* an empty onTouchStart causes :active to work on mobile iOS */}
                        <Button onTouchStart={() => { }} onClick={handleEmailAdd}>
                            <Icon name='plus' />
                            Add another email
                    </Button>
                    </div>
                </div>
            );
        }} />
    );
}

const CurrentUserPaymentField = ({ name }) => {
    return (
        <Field name={name} render={({ field, form }) => {

            const payGuest = field.value;

            const handlePortionUp = () => {
                if (payGuest.portion < 9) {
                    form.setFieldValue(`${name}.portion`, payGuest.portion + 1);
                }
            }

            const handlePortionDown = () => {
                if (payGuest.portion > 1) {
                    form.setFieldValue(`${name}.portion`, payGuest.portion - 1);
                }
            }

            return (
                <CurrentUserPayment
                    payGuest={payGuest}
                    onPortionUp={handlePortionUp}
                    onPortionDown={handlePortionDown}
                />
            );
        }} />
    )
}
const CurrentUserPayment = ({ onPortionUp, onPortionDown, payGuest }) => {
    return (
        <div className='payguest'>
            <div className='payguest-email'>
                <div className='payguest-header'>Change your portion</div>
            </div>
            <div className='payguest-portion'>
                <div>
                    <div className='payguest-portion-selector'>
                        <PortionDownButton onClick={onPortionDown} portion={payGuest.portion} />
                        <div className='payguest-portion-num'>{payGuest.portion}</div>
                        <PortionUpButton onClick={onPortionUp} portion={payGuest.portion} />
                    </div>
                    <div className='payguest-price'>${payGuest.amount.toFixed(2)}</div>
                </div>
            </div>
        </div>
    );
}

const PayOptionField = ({ name, totalAmount, userAmount }) => {

    return (
        <Field name={name} render={({ field, form }) => {

            const payOption = field.value;

            const payInFullLabel = (
                <label>
                    <div className='payinfo-option'>
                        <div>Pay in full</div>
                        <div>${totalAmount}</div>
                    </div>
                </label>
            );

            const payPortionLabel = (
                <label>
                    <div className='payinfo-option'>
                        <div>Split order</div>
                        {payOption === PayOptions.split &&
                            <div>Your portion: ${userAmount.toFixed(2)}</div>
                        }
                    </div>
                </label>
            );

            const selectedStyle = (isSelected) => {
                const style = {};
                if (isSelected) {
                    style.backgroundColor = Colors.Alpha.purple('10');
                    style.border = `solid 2px ${Colors.Alpha.purple('80')}`;
                }
                return style;
            }

            const handlePayOptionChange = (e, { value }) => {
                form.setFieldValue(name, value);
            }

            return (
                <div>
                    {form.touched && form.errors && form.errors.payOption &&
                        <Message error content={form.errors.payOption} icon='exclamation circle' />
                    }
                    <Radio
                        style={selectedStyle(payOption === PayOptions.full)}
                        label={payInFullLabel}
                        name='payoption-group'
                        value={PayOptions.full}
                        checked={payOption === PayOptions.full}
                        onChange={handlePayOptionChange} />
                    <Radio
                        style={selectedStyle(payOption === PayOptions.split)}
                        label={payPortionLabel}
                        name='payoption-group'
                        value={PayOptions.split}
                        checked={payOption === PayOptions.split}
                        onChange={handlePayOptionChange}
                    />
                </div>
            );
        }} />
    )
}