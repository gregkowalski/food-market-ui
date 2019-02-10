import ApiClient from '../../services/ApiClient'
import CognitoUtil from '../../services/Cognito/CognitoUtil'
import Url from '../../services/Url'
import { ActionTypes as ProfileActionTypes } from '../profile'
import { toast } from 'react-toastify'
import { history } from '../../History'

export const ActionTypes = {
    REQUEST_CURRENT_USER: 'REQUEST_CURRENT_USER',
    RECEIVE_CURRENT_USER_SUCCESS: 'RECEIVE_CURRENT_USER_SUCCESS',
    RECEIVE_CURRENT_USER_ERROR: 'RECEIVE_CURRENT_USER_ERROR',

    CURRENT_USER_LOGOUT: 'CURRENT_USER_LOGOUT',

    REQUEST_ACCEPT_TERMS: 'REQUEST_ACCEPT_TERMS',
    RECEIVE_ACCEPT_TERMS_SUCCESS: 'RECEIVE_ACCEPT_TERMS_SUCCESS',
    RECEIVE_ACCEPT_TERMS_ERROR: 'RECEIVE_ACCEPT_TERMS_ERROR',
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

export const Actions = {

    logOut: () => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.CURRENT_USER_LOGOUT });
        }
    },

    loadCurrentUser: () => {
        return (dispatch, getState) => {

            if (!shouldLoadCurrentUser(getState())) {
                return Promise.resolve();
            }

            dispatch({ type: ActionTypes.REQUEST_CURRENT_USER });

            return ApiClient.getUser()
                .then(
                    response => {
                        const user = response.data;
                        dispatch({ type: ActionTypes.RECEIVE_CURRENT_USER_SUCCESS, user });
                    },
                    error => {
                        toast.error(`Unable to load current user, please refresh the page. Error: ${error}`, { autoClose: false });
                        dispatch({ type: ActionTypes.RECEIVE_CURRENT_USER_ERROR });
                    }
                );
        };
    },

    acceptTerms: () => {
        return (dispatch) => {

            dispatch({ type: ActionTypes.REQUEST_ACCEPT_TERMS });

            return ApiClient.acceptTerms()
                .then(
                    () => {
                        dispatch({ type: ActionTypes.RECEIVE_ACCEPT_TERMS_SUCCESS });
                        history.push(Url.home());
                    },
                    error => {
                        const err = error && error.response && error.response.data && error.response.data.error;
                        toast.error(`Unable to accept terms at this time, please try again later. Error: ${err}`, { autoClose: false });
                        dispatch({ type: ActionTypes.RECEIVE_ACCEPT_TERMS_ERROR });
                    }
                );
        }
    },
}

export const Selectors = {
    currentUser: (state) => state.currentUser.user,
    isLoading: (state) => state.currentUser.isLoading,
    isAcceptingTerms: (state) => state.currentUser.isAcceptingTerms,
}

const initialState = {
    isLoading: false,
    isAcceptingTerms: false,
};

export const Reducers = {

    currentUser: (state = initialState, action = {}) => {
        switch (action.type) {

            case ActionTypes.REQUEST_CURRENT_USER:
                return Object.assign({}, state, {
                    isLoading: true,
                });

            case ActionTypes.RECEIVE_CURRENT_USER_SUCCESS:
                return Object.assign({}, state, {
                    isLoading: false,
                    user: action.user,
                });

            case ActionTypes.RECEIVE_CURRENT_USER_ERROR:
                return Object.assign({}, state, {
                    isLoading: false,
                });

            case ActionTypes.CURRENT_USER_LOGOUT:
                return Object.assign({}, state, {
                    isLoading: false,
                    user: null
                });

            case ActionTypes.REQUEST_ACCEPT_TERMS:
                return Object.assign({}, state, {
                    isAcceptingTerms: true,
                });

            case ActionTypes.RECEIVE_ACCEPT_TERMS_SUCCESS:
                return Object.assign({}, state, {
                    isAcceptingTerms: false,
                    user: Object.assign({}, state.user, { terms_accepted: true }),
                });

            case ActionTypes.RECEIVE_ACCEPT_TERMS_ERROR:
                return Object.assign({}, state, {
                    isAcceptingTerms: false,
                });

            case ProfileActionTypes.PROFILE_VERIFY_CODE_SUCCESS:
                return Object.assign({}, state, {
                    user: {
                        ...state.user,
                        phone: action.phone,
                        phone_verified: action.phone_verified
                    }
                });

            case ProfileActionTypes.PROFILE_RECEIVE_SAVE_USER_SUCCESS:
                return Object.assign({}, state, {
                    user: action.user,
                });

            default:
                return state;
        }
    }
};
