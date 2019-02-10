import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Actions, Selectors, PayOptions } from '../../store/order'
import { Selectors as CurrentUserSelectors } from '../../store/currentUser'
import { Field } from 'redux-form'
import { Header, Segment, Radio, Input, Icon, Button, Divider } from 'semantic-ui-react'
import './PaymentInfo.css'
import PriceCalc from '../../services/PriceCalc'
import { Colors } from '../../Constants'
import { ValidatedField } from '../../components/Validation'
import PaymentGuest from './PaymentGuest'

class PaymentInfo extends React.Component {

    state = {
        currentUserPortion: 1
    };

    render() {

        const { food, quantity, pickup } = this.props;
        const { currentUserPortion } = this.state;

        const { payOption, payGuests } = this.props;

        const totalAmount = PriceCalc.getTotalPrice(food, quantity, pickup);
        const amount = totalAmount / (currentUserPortion + payGuests.reduce((total, payGuest) => total + payGuest.portion, 0));
        const currentUserAmount = amount * currentUserPortion;
        const amounts = payGuests.map(payGuest => payGuest.portion * amount);

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
                        <div>Your portion: ${currentUserAmount.toFixed(2)}</div>
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

        return (
            <Segment className='payinfo'>
                <Header>How do you want to pay for this order?</Header>
                <Radio
                    style={selectedStyle(payOption === PayOptions.full)}
                    label={payInFullLabel}
                    name='payoption-group'
                    value={PayOptions.full}
                    checked={payOption === PayOptions.full}
                    onChange={this.handlePayOptionChange} />
                <Radio
                    style={selectedStyle(payOption === PayOptions.split)}
                    label={payPortionLabel}
                    name='payoption-group'
                    value={PayOptions.split}
                    checked={payOption === PayOptions.split}
                    onChange={this.handlePayOptionChange}
                />
                {payOption === PayOptions.split &&
                    <div className='payinfo-share'>
                        <PaymentGuest 
                            // email={'YOU: ' + currentUser.email}
                            email='Change your portion'
                            amount={currentUserAmount}
                            portion={currentUserPortion}
                            onPortionUp={this.handleCurrentUserPortionUp}
                            onPortionDown={this.handleCurrentUserPortionDown}
                            isCurrentUser={true}
                        />
                        <Divider />
                        <div className='payinfo-guest-header'>Enter email address(es):</div>
                        <Divider hidden />
                        {payGuests.map((payGuest, index) =>
                            <div key={index}>
                                <PaymentGuest
                                    index={index} email={payGuest.email} amount={amounts[index]} portion={payGuest.portion}
                                    onEmailChange={this.handleEmailChange}
                                    onEmailRemove={this.handleEmailRemove}
                                    onEmailAdd={this.handleEmailAdd}
                                    onPortionUp={this.handlePortionUp}
                                    onPortionDown={this.handlePortionDown}
                                />
                                {index + 1 < payGuests.length &&
                                    <Divider section />
                                }
                            </div>
                        )}
                        <Divider />
                        <div className='payinfo-share-add'>
                            <Button onTouchStart={() => { }} onClick={this.handleEmailAdd}>
                                <Icon name='plus' />
                                Add another email
                            </Button>
                        </div>
                    </div>
                }
            </Segment>
        );
    }

    handlePayOptionChange = (e, { value }) => {
        this.props.actions.selectPayOption(value);
    }

    handleEmailChange = (index, value) => {
        this.props.actions.changePayGuestEmail(index, value);
    }

    handleEmailRemove = (index) => {
        this.props.actions.removePayGuest(index);
    }

    handleEmailAdd = () => {
        this.props.actions.addPayGuest();
    }

    handlePortionDown = (index) => {
        this.props.actions.decreasePayGuestPortion(index);
    }

    handlePortionUp = (index) => {
        this.props.actions.increasePayGuestPortion(index);
    }

    handleCurrentUserPortionUp = () => {
        const { currentUserPortion } = this.state;
        if (currentUserPortion < 9) {
            this.setState({ currentUserPortion: currentUserPortion + 1 });
        }
    }

    handleCurrentUserPortionDown = () => {
        const { currentUserPortion } = this.state;
        if (currentUserPortion > 1) {
            this.setState({ currentUserPortion: currentUserPortion - 1 });
        }
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: CurrentUserSelectors.currentUser(state),
        payOption: Selectors.payOption(state),
        payGuests: Selectors.payGuests(state)
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
    payOption: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentInfo);


