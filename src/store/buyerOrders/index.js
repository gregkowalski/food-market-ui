import * as ActionTypes from './actionTypes'
import ApiClient from '../../services/ApiClient'
import CognitoUtil from '../../services/Cognito/CognitoUtil'
import Util from '../../services/Util'

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
}

export const Selectors = {
    orders: (state) => { return state.buyerOrders.orders; },
    isOrdersLoading: (state) => { return state.buyerOrders.isOrdersLoading; },
}

const initialState = {
    orders: [],
    isOrdersLoading: false,
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

            default:
                return state;
        }
    }
};
