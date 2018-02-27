import ApiClient from '../../Api/ApiClient'
import CognitoUtil from '../../Cognito/CognitoUtil'
import * as ActionTypes from './actionTypes'

function requestCurrentUser() {
    return {
        type: ActionTypes.REQUEST_CURRENT_USER
    };
}

function receiveCurrentUserSuccess(user) {
    return {
        type: ActionTypes.RECEIVE_CURRENT_USER_SUCCESS,
        user,
        receivedAt: Date.now()
    };
}

function receiveCurrentUseError(error) {
    return {
        type: ActionTypes.RECEIVE_CURRENT_USER_ERROR,
        error,
    };
}

function logOutCurrentUser() {
    return {
        type: ActionTypes.CURRENT_USER_LOGOUT
    };
}

export const Actions = {

    logOut: () => {
        return (dispatch) => {
            dispatch(logOutCurrentUser())
        }
    },

    loadCurrentUser: () => {
        return (dispatch) => {

            if (!CognitoUtil.isLoggedIn()) {
                return Promise.resolve();
            }

            dispatch(requestCurrentUser());

            return ApiClient.getCurrentUser()
                .then(
                    response => {
                        const user = response.data;
                        dispatch(receiveCurrentUserSuccess(user));
                    },
                    error => {
                        dispatch(receiveCurrentUseError(error));
                    }
                );
        };
    }
}

export const Selectors = {
    getCurrentUser: (state) => {
        return state.currentUser.user;
    },
    getIsLoading: (state) => {
        return state.currentUser.isLoading;
    }
}

const initialState = {
    isLoading: false,
    user: null
};

export const Reducers = {

    currentUser: (state = initialState, action = {}) => {
        switch (action.type) {
            case ActionTypes.REQUEST_CURRENT_USER:
                return Object.assign({}, state, {
                    isLoading: true
                });

            case ActionTypes.RECEIVE_CURRENT_USER_SUCCESS:
                return Object.assign({}, state, {
                    isLoading: false,
                    user: action.user
                });

            case ActionTypes.RECEIVE_CURRENT_USER_ERROR:
                return Object.assign({}, state, {
                    isLoading: false,
                    error: action.error
                });

            case ActionTypes.CURRENT_USER_LOGOUT:
                return Object.assign({}, state, {
                    isLoading: false,
                    user: null
                });

            default:
                return state;
        }
    }
};
