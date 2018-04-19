import React from 'react'
import pluralize from 'pluralize'
import { withRouter } from 'react-router-dom'
import { Header, Divider, Icon, Accordion, Button, Modal, TextArea, Segment } from 'semantic-ui-react'
import './CookOrderCard.css'
import { Constants, Colors } from '../../Constants'
import { OrderStatus } from '../../Enums'
import PriceCalc from '../../services/PriceCalc'
import Url from '../../services/Url'
import OrderExchangeMessage from './OrderExchangeMessage'

class CookOrderCard extends React.Component {

    state = { showDetails: false }

    navigateToFoodDetail = () => {
        this.props.history.push(Url.foodDetail(this.props.order.food_id));
    }

    acceptOrder = (reason) => {
        if (!this.props.isAccepting) {
            this.props.onAccept(this.props.order, reason);
        }
    }

    declineOrder = (reason) => {
        if (!this.props.isDeclining) {
            this.props.onDecline(this.props.order, reason);
        }
    }

    closeAcceptConfirmation = () => {
        this.setState({ showConfirmAccept: false });
    }

    showAcceptConfirmation = (e) => {
        this.setState({ showConfirmAccept: true });
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
        let color = Colors.lightgrey;
        if (status === OrderStatus.Accepted)
            color = Colors.green;
        else if (status === OrderStatus.Declined)
            color = Colors.red;
        else if (status === OrderStatus.Cancelled)
            color = Colors.red;

        return {
            backgroundColor: color,
        }
    }

    render() {
        const { order } = this.props;
        const { food, buyer, isAccepting, isDeclining, isCancelling } = order;
        const { showDetails, showConfirmAccept, showConfirmCancel, showConfirmDecline } = this.state;
        const quantityLabel = pluralize('order', order.quantity);

        return (
            <Segment>
                <div className='cookordercard'>
                    <div className='cookordercard-header'>
                        <div style={this.statusStyle(order.status)}>{order.status}</div>
                        {order.status === OrderStatus.Pending &&
                            <div className='cookordercard-accept'>
                                <Button fluid className='box-dropshadow cookordercard-accept' loading={isAccepting} onClick={this.showAcceptConfirmation}>Accept order</Button>
                                <Button fluid className='box-dropshadow cookordercard-decline' loading={isDeclining} onClick={this.showDeclineConfirmation}>Decline order</Button>
                            </div>
                        }
                    </div>
                    <Divider />

                    <div className='cookordercard-section cookordercard-details large-font'>
                        <div> {food.title} </div>
                        <div className='cookordercard-order-quantity'>
                            <div className='cookordercard-order-size'>
                                <div>{order.quantity}</div> 
                                <div>{quantityLabel}</div>
                                </div>
                            <div>{food.unit} <span>per order</span> </div>
                        </div>
                        <div className='cookordercard-order-exchange'>
                            <OrderExchangeMessage order={order} />
                        </div>
                        <Divider />
                    </div>
                    <Accordion>
                        <Accordion.Title active={showDetails} onClick={() => this.setState({ showDetails: !showDetails })}>
                            <div className='cookordercard-additional-details'>Additional details
                            <Icon name='angle down' />
                            </div>

                        </Accordion.Title>
                        <Accordion.Content active={showDetails}>
                            <div className='cookordercard-section'>
                                <div>{order.address}</div>
                                <Divider hidden />
                                <div>Reservation code: {order.order_id}</div>
                                <div>Total: ${PriceCalc.getTotalPrice(food, order.quantity, order.pickup)} {Constants.Currency}</div>
                                {order.accept_message}
                            </div>
                            <Divider />
                            <div className='cookordercard-section normal-font'>
                                <div className='cookordercard-buyer'>
                                    <Icon name='mail outline' size='large' />
                                    <a href={Url.mailTo(buyer.email, food.title)}>Message {buyer.name}</a>
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
                        header="Accept order - your buyer's card will be charged"
                        message="Sweet! Say hello to your buyer."
                        open={showConfirmAccept}
                        isProcessing={isAccepting}
                        onConfirm={this.acceptOrder}
                        onClose={this.closeAcceptConfirmation}
                        confirmButtonLabel='Accept order'

                    />

                    <ConfirmModal
                        header='Cancel this order'
                        message="Got it. Let your buyer know why you're cancelling."
                        open={showConfirmCancel}
                        isProcessing={isCancelling}
                        onConfirm={this.cancelOrder}
                        onClose={this.closeCancelConfirmation}
                        confirmButtonLabel='Cancel order'

                    />

                    <ConfirmModal
                        header="Roger that. Let your buyer know why you're declining."
                        open={showConfirmDecline}
                        isProcessing={isDeclining}
                        onConfirm={this.declineOrder}
                        onClose={this.closeDeclineConfirmation}
                        confirmButtonLabel='Decline order'
                    />

                </div>
            </Segment>
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

        const { header, message, open, isProcessing, onConfirm, onClose, confirmButtonLabel } = this.props;

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
                        <Header>{message}</Header>
                        <p>Write your message here</p>
                    </Modal.Description>
                    <TextArea autoHeight onChange={handleReasonChange} />
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={onClose}>Back</Button>
                    <Button loading={isProcessing} onClick={handleConfirm}>{confirmButtonLabel}</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}