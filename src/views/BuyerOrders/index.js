import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Header } from 'semantic-ui-react'
import './index.css'
import AppHeader from '../../components/AppHeader'
import LoadingIcon from '../../components/LoadingIcon'
import { Actions, Selectors } from '../../store/buyerOrders'
import BuyerOrderCard from './BuyerOrderCard'

class BuyerOrders extends React.Component {

    componentWillMount() {
        this.props.actions.loadOrders();
    }

    render() {
        const { orders, isOrdersLoading } = this.props;

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
                return (<BuyerOrderCard order={order} key={order.order_id} />);
            })
        }

        return (
            <div>
                <AppHeader />
                <div className='buyerorders'>
                    <div className='buyerorders-header'>My Orders</div>
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

BuyerOrders.propTypes = {
    orders: PropTypes.arrayOf(PropTypes.shape({
        order_id: PropTypes.string.isRequired,
    })),
    isOrdersLoading: PropTypes.bool.isRequired,

    actions: PropTypes.shape({
        loadOrders: PropTypes.func.isRequired,
    }).isRequired
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BuyerOrders));

