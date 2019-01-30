import ApiClient from '../../services/ApiClient'
import { toast } from 'react-toastify'

const ActionTypes = {
    REQUEST_PUBLIC_USER: 'REQUEST_PUBLIC_USER',
    RECEIVE_PUBLIC_USER_SUCCESS: 'RECEIVE_PUBLIC_USER_SUCCESS',
    RECEIVE_PUBLIC_USER_ERROR: 'RECEIVE_PUBLIC_USER_ERROR',
}

export const Actions = {

    loadPublicUser: (userId) => {
        return (dispatch) => {

            dispatch({ type: ActionTypes.REQUEST_PUBLIC_USER });

            return ApiClient.getPublicUser(userId)
                .then(
                    response => {
                        const user = response.data;
                        dispatch({ type: ActionTypes.RECEIVE_PUBLIC_USER_SUCCESS, user });
                    },
                    error => {
                        console.error(error);
                        dispatch({ type: ActionTypes.RECEIVE_PUBLIC_USER_ERROR });
                        toast.error(`Unable to load user profile, please try again later`);
                    }
                );
        }
    },
}

export const Selectors = {
    user: (state) => state.publicUser.user,
    isLoading: (state) => state.publicUser.isLoading,
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
                });


            case ActionTypes.RECEIVE_PUBLIC_USER_SUCCESS:
                return Object.assign({}, state, {
                    isLoading: false,
                    user: action.user
                });

            case ActionTypes.RECEIVE_PUBLIC_USER_ERROR:
                return Object.assign({}, state, {
                    isLoading: false,
                });

            default:
                return state;
        }
    }
};
