import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import moment from 'moment'
import './index.css'
import AppHeader from '../../components/AppHeader'
import AppFooter from '../../components/AppFooter'
import LoadingIcon from '../../components/LoadingIcon'
import { Actions, Selectors } from '../../store/buyerOrders'
import BuyerOrderCard from './BuyerOrderCard'
import { OrderStatus } from '../../Enums';

class BuyerOrders extends React.Component {

    componentWillMount() {
        this.props.actions.loadOrders();
    }

    handleCancelOrder = (order, reason) => {
        this.props.actions.cancelOrder(order, reason);
    }

    render() {
        const { orders, isOrdersLoading, isCancelling } = this.props;

        let content;
        if (!orders || isOrdersLoading) {
            content = (
                <div className='buyerorders-loading-icon'>
                    <LoadingIcon size='big' />
                </div>
            );
        }
        else {
            const dateAsc = (a, b) => {
                return moment(a.handoff_start_date) > moment(b.handoff_start_date);
            }
            const isUpcoming = (order) => (order.status === OrderStatus.Pending || order.status === OrderStatus.Accepted);
            const upcomingOrders = orders.filter(order => isUpcoming(order)).sort(dateAsc);
            const pastOrders = orders.filter(order => !isUpcoming(order)).sort(dateAsc);

            let upcomingOrdersContent;
            if (!upcomingOrders || upcomingOrders.length <= 0) {
                upcomingOrdersContent = (<div>No orders...</div>);
            }
            else {
                upcomingOrdersContent = upcomingOrders.map(order => {
                    return (<BuyerOrderCard key={order.order_id} order={order} isCancelling={isCancelling} onCancel={this.handleCancelOrder} />);
                });
            }

            let historyOrdersContent;
            if (!pastOrders || pastOrders.length <= 0) {
                historyOrdersContent = (<div>No orders...</div>);
            }
            else {
                historyOrdersContent = pastOrders.map(order => {
                    return (<BuyerOrderCard key={order.order_id} order={order} />);
                });
            }

            content = (
                <div>
                    {upcomingOrdersContent}
                    <div className='buyerorders-header buyerorders-header-past'>Past Orders</div>
                    {historyOrdersContent}
                </div>
            );
        }

        return (
            <div>
                <AppHeader />
                <div className='buyerorders'>
                    <div className='buyerorders-header'>My Orders</div>
                    {content}
                </div>
                <AppFooter />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        orders: Selectors.orders(state),
        isOrdersLoading: Selectors.isOrdersLoading(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};

BuyerOrders.propTypes = {
    orders: PropTypes.arrayOf(PropTypes.shape({
        order_id: PropTypes.string.isRequired,
    })),
    isOrdersLoading: PropTypes.bool.isRequired,

    actions: PropTypes.shape({
        loadOrders: PropTypes.func.isRequired,
        cancelOrder: PropTypes.func.isRequired,
    }).isRequired
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BuyerOrders));
