import React from 'react'
import pluralize from 'pluralize'
import { withRouter } from 'react-router-dom'
import { Divider, Icon, Accordion, Button, Segment } from 'semantic-ui-react'
import './CookOrderCard.css'
import { Constants, Colors } from '../../Constants'
import { OrderStatus, OrderStatusLabels } from '../../Enums'
import PriceCalc from '../../services/PriceCalc'
import Url from '../../services/Url'
import Util from '../../services/Util'
import ConfirmModal from '../../components/ConfirmModal'
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

        const handoffAddress = order.pickup ? order.cook.address : order.buyer_address;
        const handoffAddressLabel = order.pickup ? 'Pickup Address:' : 'Delivery Address:';

        return (
            <Segment>
                <div className='cookordercard'>
                    <div className='cookordercard-header'>
                        <div style={this.statusStyle(order.status)}>{OrderStatusLabels[order.status]}</div>
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
                            <div className='cookordercard-additional-details'>
                                Additional details
                                <Icon name='angle down' />
                            </div>
                        </Accordion.Title>
                        <Accordion.Content active={showDetails}>
                            <div className='cookordercard-section'>
                                {handoffAddress &&
                                    <div>
                                        <div>{handoffAddressLabel} {handoffAddress}</div>
                                        <Divider hidden />
                                    </div>
                                }
                                <div>Reservation code: {order.order_id}</div>
                                <div>Total: ${PriceCalc.getTotalPrice(food, order.quantity, order.pickup)} {Constants.Currency}</div>
                                {order.accept_message}
                            </div>
                        </Accordion.Content>
                    </Accordion>
                    <Divider />
                    <div className='cookordercard-section normal-font'>
                        <div className='cookordercard-buyer'>
                            <Icon name='envelope outline' size='large' />
                            <a href={Url.mailTo(buyer.email, food.title)}>Message {Util.firstNonEmptyValue(buyer.name, buyer.username)}</a>
                        </div>
                        {order.status === OrderStatus.Accepted &&
                            <div style={{ marginTop: '25px' }}>
                                <Icon name='calendar alternate outline' size='big' />
                                <a href='./' onClick={this.showCancelConfirmation}>Cancel order</a>
                            </div>
                        }
                    </div>

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