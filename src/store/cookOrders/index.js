import * as ActionTypes from './actionTypes'
import ApiClient from '../../services/ApiClient'
import CognitoUtil from '../../services/Cognito/CognitoUtil'

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

export const Actions = {

    loadOrders: () => {
        return (dispatch) => {

            dispatch(requestOrders());

            const user_id = CognitoUtil.getLoggedInUserId();
            return ApiClient.getOrdersByCookId(user_id)
                .then(
                    response => {
                        dispatch(receiveOrdersSuccess(response.data));
                    },
                    error => {
                        dispatch(receiveOrdersError(error));
                    }
                );
        };
    },
}

export const Selectors = {
    orders: (state) => { return state.cookOrders.orders; },
    isOrdersLoading: (state) => { return state.cookOrders.isOrdersLoading; },
}

const initialState = {
    orders: [],
    isOrdersLoading: false,
};

export const Reducers = {

    cookOrders: (state = initialState, action = {}) => {
        switch (action.type) {

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

            default:
                return state;
        }
    }
};
