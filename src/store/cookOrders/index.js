import * as ActionTypes from './actionTypes'
import ApiClient from '../../services/ApiClient'
import CognitoUtil from '../../services/Cognito/CognitoUtil'
import OrderStatus from '../../data/OrderStatus'
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

function receiveAcceptOrderSuccess(order) {
    return {
        type: ActionTypes.COOK_ORDERS_RECEIVE_ACCEPT_ORDER_SUCCESS,
        order,
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

function receiveDeclineOrderSuccess(order) {
    return {
        type: ActionTypes.COOK_ORDERS_RECEIVE_DECLINE_ORDER_SUCCESS,
        order,
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

function receiveCancelOrderSuccess(order) {
    return {
        type: ActionTypes.COOK_ORDERS_RECEIVE_CANCEL_ORDER_SUCCESS,
        order,
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

            const user_id = CognitoUtil.getLoggedInUserId();
            return ApiClient.getOrdersByCookId(user_id)
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

    acceptOrder: (order) => {
        return (dispatch) => {
            dispatch(requestAcceptOrder(order));

            return ApiClient.acceptOrder(order)
                .then(
                    response => {
                        dispatch(receiveAcceptOrderSuccess(order));
                    },
                    error => {
                        dispatch(receiveAcceptOrderError(order, error));
                    }
                )
        }
    },

    declineOrder: (order) => {
        return (dispatch) => {
            dispatch(requestDeclineOrder(order));

            return ApiClient.declineOrder(order)
                .then(
                    response => {
                        dispatch(receiveDeclineOrderSuccess(order));
                    },
                    error => {
                        dispatch(receiveDeclineOrderError(order, error));
                    }
                )
        }
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
