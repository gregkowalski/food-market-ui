import React from 'react'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import { Header, Segment, Divider, Image, Icon, Accordion, Button, Modal, TextArea } from 'semantic-ui-react'
import './CookOrderCard.css'
import Constants from '../../Constants'
import OrderStatus from '../../data/OrderStatus'
import Colors from '../../data/Colors'
import PriceCalc from '../../services/PriceCalc'
import Url from '../../services/Url'

class CookOrderCard extends React.Component {

    state = { showDetails: false }

    navigateToFoodDetail = () => {
        this.props.history.push(Url.foodDetail(this.props.order.food_id));
    }

    acceptOrder = () => {
        if (!this.props.isAccepting) {
            this.props.onAccept(this.props.order);
        }
    }

    declineOrder = (reason) => {
        if (!this.props.isDeclining) {
            this.props.onDecline(this.props.order, reason);
        }
    }

    closeDeclineConfirmation = () => {
        this.setState({ showConfirmDecline: false });
    }

    showDeclineConfirmation = (e) => {
        this.setState({ showConfirmDecline: true });
    }

    closeCancelConfirmation = () => {
        this.setState({ showConfirmCancel: false });
    }

    showCancelConfirmation = (e) => {
        e.preventDefault();
        this.setState({ showConfirmCancel: true });
    }

    cancelOrder = (reason) => {
        if (!this.props.isCancelling) {
            this.props.onCancel(this.props.order, reason);
        }
    }

    statusStyle(status) {
        let color = Colors.purple;
        if (status === OrderStatus.Accepted)
            color = Colors.green;
        else if (status === OrderStatus.Declined)
            color = Colors.red;
        else if (status === OrderStatus.Cancelled)
            color = Colors.grey;

        return {
            backgroundColor: color,
        }
    }

    render() {
        const { order } = this.props;
        const { food, cook, isAccepting, isDeclining, isCancelling } = order;
        const { showDetails, showConfirmCancel, showConfirmDecline } = this.state;

        return (
            <div className='cookordercard'>
                <div style={this.statusStyle(order.status)}>{order.status}</div>

                <Accordion>
                    <Accordion.Title active={showDetails} onClick={() => this.setState({ showDetails: !showDetails })}>
                        <div className='cookordercard-section large-font'>
                            <div>
                                <Icon name='dropdown' />
                                {food.title}
                                &nbsp; @ {order.time}
                                &nbsp; (${PriceCalc.getTotalPrice(food, order.quantity, order.pickup)} {Constants.Currency})
                                &nbsp; {order.pickup ? 'Pickup' : 'Delivery'}
                            </div>
                        </div>
                    </Accordion.Title>
                    {order.status === OrderStatus.Pending &&
                        <div>
                            <Button className='box-dropshadow' color='green' loading={isAccepting} onClick={this.acceptOrder}>Accept</Button>
                            <Button className='box-dropshadow' color='red' loading={isDeclining} onClick={this.showDeclineConfirmation}>Decline</Button>
                        </div>
                    }
                    <Accordion.Content active={showDetails}>
                        <Divider />
                        <div className='cookordercard-section'>
                            <div>Reservation code: {order.order_id}</div>
                            <div>Quantity: {order.quantity}</div>
                            <div>Total: ${PriceCalc.getTotalPrice(food, order.quantity, order.pickup)} {Constants.Currency}</div>
                        </div>
                        <Divider />
                        <div className='cookordercard-section normal-font'>
                            <div className='cookordercard-cook'>
                                <Image src={cook.image} circular size='mini' floated='left' />
                                <a href={Url.mailTo(cook.email, food.title)}>Message {cook.name}</a>
                            </div>
                            {order.status === OrderStatus.Accepted &&
                                <div style={{ marginTop: '25px' }}>
                                    <Icon name='calendar' size='big' />
                                    <a href='./' onClick={this.showCancelConfirmation}>Cancel order</a>
                                </div>
                            }

                        </div>
                    </Accordion.Content>
                </Accordion>

                <ConfirmModal
                    header='Confirm Cancellation'
                    message="Let the buyer know why you're cancelling"
                    open={showConfirmCancel}
                    isProcessing={isCancelling}
                    onConfirm={this.cancelOrder}
                    onClose={this.closeCancelConfirmation}
                />

                <ConfirmModal
                    header='Confirm Decline'
                    message="Let the buyer know why you're declining"
                    open={showConfirmDecline}
                    isProcessing={isDeclining}
                    onConfirm={this.declineOrder}
                    onClose={this.closeDeclineConfirmation}
                />

            </div>
        )
    }
}

export default withRouter(CookOrderCard);

class ConfirmModal extends React.Component {

    componentWillReceiveProps(nextProps) {
        if (this.props.isProcessing && !nextProps.isProcessing) {
            this.props.onClose();
        }
    }

    render() {

        const { header, message, open, isProcessing, onConfirm, onClose } = this.props;

        let reason;
        const handleReasonChange = (event, data) => {
            reason = data.value;
        };

        const handleConfirm = () => {
            onConfirm(reason);
        };

        return (
            <Modal open={open} dimmer='inverted' onClose={onClose}>
                <Modal.Header>{header}</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Header>Add a message</Header>
                        <p>{message}</p>
                    </Modal.Description>
                    <TextArea autoHeight onChange={handleReasonChange} />
                </Modal.Content>
                <Modal.Actions>
                    <Button loading={isProcessing} onClick={handleConfirm}>Confirm</Button>
                    <Button onClick={onClose}>Back</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}