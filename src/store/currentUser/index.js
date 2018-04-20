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

    const isLoading = Selectors.isLoading(state);
    if (isLoading) {
        return false;
    }

    const currentUser = Selectors.currentUser(state);
    if (currentUser) {
        return false;
    }

    return true;
}

function requestSaveUser() {
    return { type: ActionTypes.REQUEST_SAVE_USER };
}

function receiveSaveUserSuccess() {
    return { type: ActionTypes.RECEIVE_SAVE_USER_SUCCESS };
}

function receiveSaveUserError(error) {
    return {
        type: ActionTypes.RECEIVE_SAVE_USER_ERROR,
        error,
    };
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
    },

    saveUser: (user) => {
        return (dispatch) => {

            dispatch(requestSaveUser());

            return ApiClient.saveUserProfile(user)
                .then(
                    response => {
                        dispatch(receiveSaveUserSuccess());
                    },
                    error => {
                        dispatch(receiveSaveUserError(error));
                    }
                );
        };
    }
}

export const Selectors = {
    currentUser: (state) => state.currentUser.user,
    isLoading: (state) => state.currentUser.isLoading,
    isSaving: (state) => state.currentUser.isSaving,
    errorCode: (state) => state.currentUser.errorCode,
    error: (state) => state.currentUser.error,
}

const initialState = {
    isLoading: false,
    isSaving: false
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



            case ActionTypes.REQUEST_SAVE_USER:
                return Object.assign({}, state, {
                    isSaving: true
                });

            case ActionTypes.RECEIVE_SAVE_USER_SUCCESS:
                return Object.assign({}, state, {
                    isSaving: false
                });

            case ActionTypes.RECEIVE_SAVE_USER_ERROR:
                return Object.assign({}, state, {
                    isSaving: false,
                    error: action.error,
                });

            default:
                return state;
        }
    }
};
