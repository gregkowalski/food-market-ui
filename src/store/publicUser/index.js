import ApiClient from '../../services/ApiClient'
import * as ActionTypes from './actionTypes'

function requestPublicUser() {
    return {
        type: ActionTypes.REQUEST_PUBLIC_USER
    };
}

function receivePublicUserSuccess(user) {
    return {
        type: ActionTypes.RECEIVE_PUBLIC_USER_SUCCESS,
        user,
        receivedAt: Date.now()
    };
}

function receivePublicUserError(apiError) {
    return {
        type: ActionTypes.RECEIVE_PUBLIC_USER_ERROR,
        apiError,
    };
}

export const Actions = {

    loadPublicUser: (userId) => {
        return (dispatch) => {

            dispatch(requestPublicUser());

            return ApiClient.getPublicUser(userId)
                .then(
                    response => {
                        const user = response.data;
                        dispatch(receivePublicUserSuccess(user));
                    },
                    error => {
                        dispatch(receivePublicUserError(error));
                    }
                );
        }
    },
}

export const Selectors = {
    user: (state) => state.publicUser.user,
    isLoading: (state) => state.publicUser.isLoading,
    apiError: (state) => state.currentUser.apiError,
}

const initialState = {
    isLoading: false,
};

export const Reducers = {

    publicUser: (state = initialState, action = {}) => {
        switch (action.type) {

            case ActionTypes.REQUEST_PUBLIC_USER:
                return Object.assign({}, state, {
                    isLoading: true,
                    apiError: undefined
                });


            case ActionTypes.RECEIVE_PUBLIC_USER_SUCCESS:
                return Object.assign({}, state, {
                    isLoading: false,
                    user: action.user
                });

            case ActionTypes.RECEIVE_PUBLIC_USER_ERROR:
                return Object.assign({}, state, {
                    isLoading: false,
                    apiError: action.apiError
                });

            default:
                return state;
        }
    }
};
