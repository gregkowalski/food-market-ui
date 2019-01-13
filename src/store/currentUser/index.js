import ApiClient from '../../services/ApiClient'
import CognitoUtil from '../../services/Cognito/CognitoUtil'

export const ActionTypes = {
    REQUEST_CURRENT_USER: 'REQUEST_CURRENT_USER',
    RECEIVE_CURRENT_USER_SUCCESS: 'RECEIVE_CURRENT_USER_SUCCESS',
    RECEIVE_CURRENT_USER_ERROR: 'RECEIVE_CURRENT_USER_ERROR',

    CURRENT_USER_LOGOUT: 'CURRENT_USER_LOGOUT',
    REQUEST_SAVE_USER: 'REQUEST_SAVE_USER',
    RECEIVE_SAVE_USER_SUCCESS: 'RECEIVE_SAVE_USER_SUCCESS',
    RECEIVE_SAVE_USER_ERROR: 'RECEIVE_SAVE_USER_ERROR',
    REQUEST_ACCEPT_TERMS: 'REQUEST_ACCEPT_TERMS',
    RECEIVE_ACCEPT_TERMS_SUCCESS: 'RECEIVE_ACCEPT_TERMS_SUCCESS',
    RECEIVE_ACCEPT_TERMS_ERROR: 'RECEIVE_ACCEPT_TERMS_ERROR',
}

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

function receiveCurrentUserError(apiError) {
    return {
        type: ActionTypes.RECEIVE_CURRENT_USER_ERROR,
        apiError,
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

function receiveSaveUserSuccess(user) {
    return {
        type: ActionTypes.RECEIVE_SAVE_USER_SUCCESS,
        user
    };
}

function receiveSaveUserError(apiError) {
    return {
        type: ActionTypes.RECEIVE_SAVE_USER_ERROR,
        apiError,
    };
}

function requestAcceptTerms() {
    return { type: ActionTypes.REQUEST_ACCEPT_TERMS };
}

function receiveAcceptTermsSuccess(user) {
    return {
        type: ActionTypes.RECEIVE_ACCEPT_TERMS_SUCCESS,
        user
    };
}

function receiveAcceptTermsError(apiError) {
    return {
        type: ActionTypes.RECEIVE_ACCEPT_TERMS_ERROR,
        apiError,
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

            return ApiClient.getUser()
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

            return ApiClient.saveUser(user)
                .then(
                    response => {
                        dispatch(receiveSaveUserSuccess(user));
                    },
                    error => {
                        const err = error && error.response && error.response.data && error.response.data.error;
                        dispatch(receiveSaveUserError(err));
                    }
                );
        };
    },

    acceptTerms: () => {
        return (dispatch, getState) => {

            dispatch(requestAcceptTerms());

            return ApiClient.acceptTerms()
                .then(
                    response => {
                        const user = Selectors.currentUser(getState());
                        dispatch(receiveAcceptTermsSuccess(user));
                    },
                    error => {
                        const err = error && error.response && error.response.data && error.response.data.error;
                        dispatch(receiveAcceptTermsError(err));
                    }
                );
        }
    }
}

export const Selectors = {
    currentUser: (state) => state.currentUser.user,
    isLoading: (state) => state.currentUser.isLoading,
    isSaving: (state) => state.currentUser.isSaving,
    apiError: (state) => state.currentUser.apiError,
    termsAccepted: (state) => state.currentUser.termsAccepted,
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
                    isLoading: true,
                    apiError: null
                });

            case ActionTypes.RECEIVE_CURRENT_USER_SUCCESS:
                return Object.assign({}, state, {
                    isLoading: false,
                    user: action.user
                });

            case ActionTypes.RECEIVE_CURRENT_USER_ERROR:
                return Object.assign({}, state, {
                    isLoading: false,
                    apiError: action.apiError,
                });



            case ActionTypes.CURRENT_USER_LOGOUT:
                return Object.assign({}, state, {
                    isLoading: false,
                    user: null
                });



            case ActionTypes.REQUEST_SAVE_USER:
                return Object.assign({}, state, {
                    isSaving: true,
                    apiError: null
                });

            case ActionTypes.RECEIVE_SAVE_USER_SUCCESS:
                return Object.assign({}, state, {
                    isSaving: false,
                    user: action.user
                });

            case ActionTypes.RECEIVE_SAVE_USER_ERROR:
                return Object.assign({}, state, {
                    isSaving: false,
                    apiError: action.apiError,
                });



            case ActionTypes.REQUEST_ACCEPT_TERMS:
                return Object.assign({}, state, {
                    isSaving: true,
                    apiError: null
                });

            case ActionTypes.RECEIVE_ACCEPT_TERMS_SUCCESS:
                return Object.assign({}, state, {
                    isSaving: false,
                    user: Object.assign({}, action.user, { terms_accepted: true }),
                    termsAccepted: true
                });

            case ActionTypes.RECEIVE_ACCEPT_TERMS_ERROR:
                return Object.assign({}, state, {
                    isSaving: false,
                    apiError: action.apiError,
                });

            default:
                return state;
        }
    }
};
