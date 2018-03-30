import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import './index.css'
import AppHeader from '../../components/AppHeader'
import LoadingIcon from '../../components/LoadingIcon'
import { Actions, Selectors } from '../../store/cookOrders'
import CookOrderCard from './CookOrderCard'

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

    render() {
        const { orders, isOrdersLoading } = this.props;

        let content;
        if (!orders || isOrdersLoading) {
            content = (
                <div className='cookorders-loading-icon'>
                    <LoadingIcon size='big' />
                </div>
            );
        }
        else {
            content = orders.map(order => {
                return (<CookOrderCard
                    key={order.order_id}
                    order={order}
                    onAccept={this.handleAcceptOrder}
                    onDecline={this.handleDeclineOrder}
                    onCancel={this.handleCancelOrder}
                />);
            })
        }

        return (
            <div>
                <AppHeader />
                <div className='cookorders'>
                    <div className='cookorders-header'>Cooking Requests</div>
                    {content}
                </div>
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

CookOrders.propTypes = {
    orders: PropTypes.arrayOf(PropTypes.shape({
        order_id: PropTypes.string.isRequired,
    })),
    isOrdersLoading: PropTypes.bool.isRequired,

    actions: PropTypes.shape({
        loadOrders: PropTypes.func.isRequired,
    }).isRequired
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CookOrders));