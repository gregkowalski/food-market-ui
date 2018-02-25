import { combineReducers } from 'redux';
import ApiClient from '../Api/ApiClient'
import CognitoUtil from '../Cognito/CognitoUtil'

const REQUEST_CURRENT_USER = 'REQUEST_CURRENT_USER';
const RECEIVE_CURRENT_USER_SUCCESS = 'RECEIVE_CURRENT_USER_SUCCESS';
const RECEIVE_CURRENT_USER_ERROR = 'RECEIVE_CURRENT_USER_ERROR';
const CURRENT_USER_LOGOUT = 'CURRENT_USER_LOGOUT';

function requestCurrentUser() {
    return {
        type: REQUEST_CURRENT_USER
    };
}

function receiveCurrentUserSuccess(user) {
    return {
        type: RECEIVE_CURRENT_USER_SUCCESS,
        user,
        receivedAt: Date.now()
    };
}

function receiveCurrentUseError(error) {
    return {
        type: RECEIVE_CURRENT_USER_ERROR,
        error,
    };
}

function logOutCurrentUser() {
    return {
        type: CURRENT_USER_LOGOUT
    };
}

function getCurrentUser() {
    return (dispatch) => {

        if (!CognitoUtil.isLoggedIn()) {
            return;
        }

        dispatch(requestCurrentUser());

        let api = new ApiClient();
        return api.getCurrentUser()
            .then(
                response => {
                    const user = {
                        userId: response.data.user_id,
                        username: response.data.username,
                    };
                    dispatch(receiveCurrentUserSuccess(user));
                },
                error => {
                    dispatch(receiveCurrentUseError(error));
                }
            );

    };
}

function logOut() {
    return (dispatch) => {
        dispatch(logOutCurrentUser())
    }
}

export const Actions = {
    getCurrentUser, logOut
}

function currentUserReducer(state = {
    isLoading: false,
    user: null
}, action) {
    switch (action.type) {
        case REQUEST_CURRENT_USER:
            return Object.assign({}, state, {
                isLoading: true
            });

        case RECEIVE_CURRENT_USER_SUCCESS:
            return Object.assign({}, state, {
                isLoading: false,
                user: action.user
            });

        case RECEIVE_CURRENT_USER_ERROR:
            return Object.assign({}, state, {
                isLoading: false,
                error: action.error
            });

        case CURRENT_USER_LOGOUT:
            return Object.assign({}, state, {
                isLoading: false,
                user: null
            });

        default:
            return state;
    }
}

// export default combineReducers({
//     currentUser,
// });

export default currentUserReducer;
