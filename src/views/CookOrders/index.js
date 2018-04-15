import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import moment from 'moment'
import './index.css'
import AppHeader from '../../components/AppHeader'
import LoadingIcon from '../../components/LoadingIcon'
import Link from '../../components/Link'
import Util from '../../services/Util'
import { Actions, Selectors } from '../../store/cookOrders'
import OrderFilters from '../../store/cookOrders/orderFilters'
import CookOrderByDateCard from './CookOrderByDateCard'
import { OrderStatus } from '../../Enums'

class CookOrders extends React.Component {

    componentWillMount() {
        this.props.actions.loadOrders();
    }

    handleAcceptOrder = (order, reason) => {
        this.props.actions.acceptOrder(order, reason);
    }

    handleDeclineOrder = (order, reason) => {
        this.props.actions.declineOrder(order, reason);
    }

    handleCancelOrder = (order, reason) => {
        this.props.actions.cancelOrder(order, reason);
    }

    handleUpcomingOrderClick = () => {
        this.props.actions.setOrderFilter(OrderFilters.UPCOMING);
    }

    handleInactiveOrderClick = () => {
        this.props.actions.setOrderFilter(OrderFilters.INACTIVE);
    }

    render() {
        const { orders, isOrdersLoading, orderFilter } = this.props;

        let content;
        if (!orders || isOrdersLoading) {
            content = (
                <div className='cookorders-loading-icon'>
                    <LoadingIcon size='big' />
                </div>
            );
        }
        else if (orders.length <= 0) {
            content = (
                <div>
                    No orders...
                </div>
            );
        }
        else {
            const ordersByDay = Util.groupBy(orders, order => moment(order.handoff_date).format('YYYY-MM-DD'));
            const ordersByDayArray = Array.from(ordersByDay.entries());
            const sortedOrdersByDay = ordersByDayArray.sort(([a], [b]) => {
                return moment(a) > moment(b);
            });
            content = sortedOrdersByDay.map(([day, dayOrders]) => {
                return (
                    <CookOrderByDateCard key={day}
                        day={day}
                        orders={dayOrders}
                        orderFilter={orderFilter}
                        onAccept={this.handleAcceptOrder}
                        onDecline={this.handleDeclineOrder}
                        onCancel={this.handleCancelOrder}
                    />
                );
            });
        }

        return (
            <div>
                <AppHeader />
                <div className='cookorders'>
                    <div className='cookorders-header'>
                        <Link active={orderFilter === OrderFilters.UPCOMING} onClick={this.handleUpcomingOrderClick}>Upcoming Requests</Link>
                        <Link active={orderFilter === OrderFilters.INACTIVE} onClick={this.handleInactiveOrderClick}>Order History</Link>
                    </div>
                    {content}
                </div>
            </div>
        )
    }
}

const getVisibleOrders = (orders, filter) => {
    const isUpcoming = (order) => {
        return (order.status === OrderStatus.Accepted || order.status === OrderStatus.Pending);
    };

    switch (filter) {
        case OrderFilters.INACTIVE:
            return orders.filter(order => !isUpcoming(order));

        case OrderFilters.UPCOMING:
            return orders.filter(order => isUpcoming(order));

        default:
            return orders;
    }
}

const mapStateToProps = (state) => {
    return {
        orders: getVisibleOrders(Selectors.orders(state), Selectors.orderFilter(state)),
        isOrdersLoading: Selectors.isOrdersLoading(state),
        orderFilter: Selectors.orderFilter(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};

CookOrders.propTypes = {
    orders: PropTypes.arrayOf(PropTypes.shape({
        order_id: PropTypes.string.isRequired,
    })),
    isOrdersLoading: PropTypes.bool.isRequired,
    orderFilter: PropTypes.string.isRequired,

    actions: PropTypes.shape({
        loadOrders: PropTypes.func.isRequired,
    }).isRequired
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CookOrders));