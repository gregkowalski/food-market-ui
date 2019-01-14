import * as ActionTypes from './actionTypes'
import ApiClient from '../../services/ApiClient'
import ApiObjectMapper from '../../services/ApiObjectMapper'
import { OrderStatus } from '../../Enums'
import OrderFilters from './orderFilters';
import Util from '../../services/Util'
import { updateOrder } from '../orderHelper'

function requestOrders() {
    return {
        type: ActionTypes.COOK_ORDERS_REQUEST_ORDERS
    };
}

function receiveOrdersSuccess(orders) {
    return {
        type: ActionTypes.COOK_ORDERS_RECEIVE_ORDERS_SUCCESS,
        orders,
        receivedAt: Date.now()
    };
}

function receiveOrdersError(error) {
    return {
        type: ActionTypes.COOK_ORDERS_RECEIVE_ORDERS_ERROR,
        error,
        receivedAt: Date.now()
    };
}

function requestAcceptOrder(order) {
    return {
        type: ActionTypes.COOK_ORDERS_REQUEST_ACCEPT_ORDER,
        order
    };
}

function receiveAcceptOrderSuccess(order, reason) {
    return {
        type: ActionTypes.COOK_ORDERS_RECEIVE_ACCEPT_ORDER_SUCCESS,
        order,
        reason,
        receivedAt: Date.now()
    };
}

function receiveAcceptOrderError(order, error) {
    return {
        type: ActionTypes.COOK_ORDERS_RECEIVE_ACCEPT_ORDER_ERROR,
        order,
        error,
        receivedAt: Date.now()
    };
}

function requestDeclineOrder(order) {
    return {
        type: ActionTypes.COOK_ORDERS_REQUEST_DECLINE_ORDER,
        order
    };
}

function receiveDeclineOrderSuccess(order, reason) {
    return {
        type: ActionTypes.COOK_ORDERS_RECEIVE_DECLINE_ORDER_SUCCESS,
        order,
        reason,
        receivedAt: Date.now()
    };
}

function receiveDeclineOrderError(order, error) {
    return {
        type: ActionTypes.COOK_ORDERS_RECEIVE_DECLINE_ORDER_ERROR,
        order,
        error,
        receivedAt: Date.now()
    };
}

function requestCancelOrder(order) {
    return {
        type: ActionTypes.COOK_ORDERS_REQUEST_CANCEL_ORDER,
        order
    };
}

function receiveCancelOrderSuccess(order, reason) {
    return {
        type: ActionTypes.COOK_ORDERS_RECEIVE_CANCEL_ORDER_SUCCESS,
        order,
        reason,
        receivedAt: Date.now()
    };
}

function receiveCancelOrderError(order, error) {
    return {
        type: ActionTypes.COOK_ORDERS_RECEIVE_CANCEL_ORDER_ERROR,
        order,
        error: error,
        receivedAt: Date.now()
    };
}

export const Actions = {

    loadOrders: () => {
        return (dispatch) => {

            dispatch(requestOrders());

            return ApiClient.getOrdersByCookId()
                .then(
                    response => {
                        const orders = ApiObjectMapper.mapOrders(Util.toArray(response.data));
                        dispatch(receiveOrdersSuccess(orders));
                    },
                    error => {
                        dispatch(receiveOrdersError(error));
                    }
                );
        };
    },

    acceptOrder: (order, reason) => {
        return (dispatch) => {
            dispatch(requestAcceptOrder(order));

            return ApiClient.acceptOrder(order, reason)
                .then(
                    response => {
                        dispatch(receiveAcceptOrderSuccess(order, reason));
                    },
                    error => {
                        dispatch(receiveAcceptOrderError(order, error));
                    }
                )
        }
    },

    declineOrder: (order, reason) => {
        return (dispatch) => {
            dispatch(requestDeclineOrder(order));

            return ApiClient.declineOrder(order, reason)
                .then(
                    response => {
                        dispatch(receiveDeclineOrderSuccess(order, reason));
                    },
                    error => {
                        dispatch(receiveDeclineOrderError(order, error));
                    }
                )
        }
    },

    cancelOrder: (order, reason) => {
        return (dispatch) => {
            dispatch(requestCancelOrder(order));

            return ApiClient.cancelOrder(order, reason)
                .then(
                    response => {
                        dispatch(receiveCancelOrderSuccess(order, reason));
                    },
                    error => {
                        dispatch(receiveCancelOrderError(order, error));
                    }
                )
        }
    },

    setOrderFilter: (orderFilter) => {
        return (dispatch) => {
            dispatch({
                type: ActionTypes.COOK_ORDERS_SET_FILTER,
                orderFilter
            });
        }
    }
}

export const Selectors = {
    orders: (state) => { return state.cookOrders.orders; },
    orderFilter: (state) => { return state.cookOrders.orderFilter },
    isOrdersLoading: (state) => { return state.cookOrders.isOrdersLoading; },
}

const initialState = {
    orders: [],
    isOrdersLoading: false,
    orderFilter: OrderFilters.UPCOMING
};

export const Reducers = {

    cookOrders: (state = initialState, action = {}) => {

        switch (action.type) {

            case ActionTypes.COOK_ORDERS_SET_FILTER:
                return Object.assign({}, state, {
                    orderFilter: action.orderFilter
                });

            case ActionTypes.COOK_ORDERS_REQUEST_ORDERS:
                return Object.assign({}, state, {
                    isOrdersLoading: true
                });

            case ActionTypes.COOK_ORDERS_RECEIVE_ORDERS_SUCCESS:
                return Object.assign({}, state, {
                    isOrdersLoading: false,
                    orders: action.orders
                });

            case ActionTypes.COOK_ORDERS_RECEIVE_ORDERS_ERROR:
                return Object.assign({}, state, {
                    isOrdersLoading: false,
                    error: action.error
                });




            case ActionTypes.COOK_ORDERS_REQUEST_ACCEPT_ORDER:
                return updateOrder(state, action, {
                    isAccepting: true
                });

            case ActionTypes.COOK_ORDERS_RECEIVE_ACCEPT_ORDER_SUCCESS:
                return updateOrder(state, action, {
                    isAccepting: false,
                    accept_message: action.reason,
                    status: OrderStatus.Accepted
                });

            case ActionTypes.COOK_ORDERS_RECEIVE_ACCEPT_ORDER_ERROR:
                return updateOrder(state, action, {
                    isAccepting: false,
                    error: action.error
                });




            case ActionTypes.COOK_ORDERS_REQUEST_DECLINE_ORDER:
                return updateOrder(state, action, {
                    isDeclining: true
                });

            case ActionTypes.COOK_ORDERS_RECEIVE_DECLINE_ORDER_SUCCESS:
                return updateOrder(state, action, {
                    isDeclining: false,
                    decline_message: action.reason,
                    status: OrderStatus.Declined
                });

            case ActionTypes.COOK_ORDERS_RECEIVE_DECLINE_ORDER_ERROR:
                return updateOrder(state, action, {
                    isDeclining: false,
                    error: action.error
                });




            case ActionTypes.COOK_ORDERS_REQUEST_CANCEL_ORDER:
                return updateOrder(state, action, {
                    isCancelling: true
                });

            case ActionTypes.COOK_ORDERS_RECEIVE_CANCEL_ORDER_SUCCESS:
                return updateOrder(state, action, {
                    isCancelling: false,
                    cancel_message: action.reason,
                    status: OrderStatus.Cancelled
                });

            case ActionTypes.COOK_ORDERS_RECEIVE_CANCEL_ORDER_ERROR:
                return updateOrder(state, action, {
                    isCancelling: false,
                    error: action.error
                });




            default:
                return state;
        }
    }
};
