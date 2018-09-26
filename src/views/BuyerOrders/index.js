import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import './index.css'
import AppHeader from '../../components/AppHeader'
import AppFooter from '../../components/AppFooter'
import LoadingIcon from '../../components/LoadingIcon'
import { Actions, Selectors } from '../../store/buyerOrders'
import BuyerOrderCard from './BuyerOrderCard'

class BuyerOrders extends React.Component {

    componentWillMount() {
        this.props.actions.loadOrders();
    } 

    handleCancelOrder = (order) => {
        this.props.actions.cancelOrder(order);
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
            content = orders.map(order => {
                return (<BuyerOrderCard order={order} isCancelling={isCancelling} onCancel={this.handleCancelOrder} key={order.order_id} />);
            });
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
