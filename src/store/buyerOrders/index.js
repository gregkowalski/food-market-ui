import * as ActionTypes from './actionTypes'
import ApiClient from '../../services/ApiClient'
import CognitoUtil from '../../services/Cognito/CognitoUtil'
import Util from '../../services/Util'
import OrderStatus from '../../data/OrderStatus'
import { updateOrder } from '../orderHelper'

function requestOrders() {
    return {
        type: ActionTypes.BUYER_ORDERS_REQUEST_ORDERS
    };
}

function receiveOrdersSuccess(orders) {
    return {
        type: ActionTypes.BUYER_ORDERS_RECEIVE_ORDERS_SUCCESS,
        orders,
        receivedAt: Date.now()
    };
}

function receiveOrdersError(error) {
    return {
        type: ActionTypes.BUYER_ORDERS_RECEIVE_ORDERS_ERROR,
        error,
        receivedAt: Date.now()
    };
}

function requestCancelOrder(order) {
    return {
        type: ActionTypes.BUYER_ORDERS_REQUEST_CANCEL_ORDER,
        order
    };
}

function receiveCancelOrderSuccess(order) {
    return {
        type: ActionTypes.BUYER_ORDERS_RECEIVE_CANCEL_ORDER_SUCCESS,
        order,
        receivedAt: Date.now()
    };
}

function receiveCancelOrderError(order, error) {
    return {
        type: ActionTypes.BUYER_ORDERS_RECEIVE_CANCEL_ORDER_ERROR,
        order,
        error: error,
        receivedAt: Date.now()
    };
}

export const Actions = {

    loadOrders: () => {
        return (dispatch) => {

            dispatch(requestOrders());

            const user_id = CognitoUtil.getLoggedInUserId();
            return ApiClient.getOrdersByBuyerId(user_id)
                .then(
                    response => {
                        const orders = Util.toArray(response.data);
                        dispatch(receiveOrdersSuccess(orders));
                    },
                    error => {
                        dispatch(receiveOrdersError(error));
                    }
                );
        };
    },

    cancelOrder: (order) => {
        return (dispatch) => {
            dispatch(requestCancelOrder(order));

            return ApiClient.cancelOrder(order)
                .then(
                    response => {
                        dispatch(receiveCancelOrderSuccess(order));
                    },
                    error => {
                        dispatch(receiveCancelOrderError(order, error));
                    }
                )
        }
    },
}

export const Selectors = {
    orders: (state) => { return state.buyerOrders.orders; },
    isOrdersLoading: (state) => { return state.buyerOrders.isOrdersLoading; },
    isCancelling: (state) => { return state.buyerOrders.isCancelling; },
}

const initialState = {
    orders: [],
    isOrdersLoading: false,
    isCancelling: false
};

export const Reducers = {

    buyerOrders: (state = initialState, action = {}) => {
        switch (action.type) {

            case ActionTypes.BUYER_ORDERS_REQUEST_ORDERS:
                return Object.assign({}, state, {
                    isOrdersLoading: true
                });

            case ActionTypes.BUYER_ORDERS_RECEIVE_ORDERS_SUCCESS:
                return Object.assign({}, state, {
                    isOrdersLoading: false,
                    orders: action.orders
                });

            case ActionTypes.BUYER_ORDERS_RECEIVE_ORDERS_ERROR:
                return Object.assign({}, state, {
                    isOrdersLoading: false,
                    error: action.error
                });

            
            case ActionTypes.BUYER_ORDERS_REQUEST_CANCEL_ORDER:
                return updateOrder(state, action, {
                    isCancelling: true
                });

            case ActionTypes.BUYER_ORDERS_RECEIVE_CANCEL_ORDER_SUCCESS:
                return updateOrder(state, action, {
                    isCancelling: false,
                    status: OrderStatus.Cancelled
                });

            case ActionTypes.BUYER_ORDERS_RECEIVE_CANCEL_ORDER_ERROR:
                return updateOrder(state, action, {
                    isCancelling: false,
                    error: action.error
                });

            default:
                return state;
        }
    }
};
