import ApiClient from '../../services/ApiClient'
import CognitoUtil from '../../services/Cognito/CognitoUtil'
import * as ActionTypes from './actionTypes'
import ErrorCodes from '../../services/ErrorCodes'

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

function receiveCurrentUserError(error) {
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

function shouldLoadCurrentUser(state) {
    if (!CognitoUtil.isLoggedIn()) {
        return false;
    }

    const isLoading = Selectors.getIsLoading(state);
    if (isLoading) {
        return false;
    }

    const currentUser = Selectors.getCurrentUser(state);
    if (currentUser) {
        return false;
    }

    return true;
}

export const Actions = {

    logOut: () => {
        return (dispatch) => {
            dispatch(logOutCurrentUser())
        }
    },

    loadCurrentUser: () => {
        return (dispatch, getState) => {

            if (!shouldLoadCurrentUser(getState())) {
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
                        dispatch(receiveCurrentUserError(error));
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
    },
    errorCode: (state) => {
        return state.currentUser.errorCode;
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
                    error: action.error,
                    errorCode: ErrorCodes.USER_DOES_NOT_EXIST
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
