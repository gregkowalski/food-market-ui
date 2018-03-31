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
import OrderStatus from '../../data/OrderStatus';

class CookOrders extends React.Component {

    componentWillMount() {
        this.props.actions.loadOrders();
    }

    handleAcceptOrder = (order) => {
        this.props.actions.acceptOrder(order);
    }

    handleDeclineOrder = (order) => {
        this.props.actions.declineOrder(order);
    }

    handleCancelOrder = (order) => {
        this.props.actions.cancelOrder(order);
    }

    handleUpcomingOrderClick = () => {
        this.props.actions.setOrderFilter(OrderFilters.UPCOMING);
    }

    handlePastOrderClick = () => {
        this.props.actions.setOrderFilter(OrderFilters.PAST);
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
            const ordersByDay = Util.groupBy(orders, o => o.date.format('YYYY-MM-DD'));
            const ordersByDayArray = Array.from(ordersByDay.entries());
            const sortedOrdersByDay = ordersByDayArray.sort(([a], [b]) => {
                return moment(a) > moment(b);
            });
            content = sortedOrdersByDay.map(([day, dayOrders]) => {
                return (
                    <CookOrderByDateCard key={day}
                        day={day}
                        orders={dayOrders}
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
                        <Link active={orderFilter === OrderFilters.PAST} onClick={this.handlePastOrderClick}>Past Orders</Link>
                    </div>
                    {content}
                </div>
            </div>
        )
    }
}

const getVisibleOrders = (orders, filter) => {
    switch (filter) {
        case OrderFilters.PAST:
            return orders.filter(o => o.status === OrderStatus.Declined || o.status === OrderStatus.Cancelled);

        case OrderFilters.UPCOMING:
            return orders.filter(o => o.status === OrderStatus.Accepted || o.status === OrderStatus.Pending);

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