import ApiClient from '../../services/ApiClient'
import ErrorCodes from '../../services/ErrorCodes'
import Url from '../../services/Url'
import CognitoUtil from '../../services/Cognito/CognitoUtil'
import { history } from '../../History'
import { toast } from 'react-toastify'

const ActionTypes = {
    ADMIN_REQUEST_INVITE_USER: 'ADMIN_REQUEST_INVITE_USER',
    ADMIN_RECEIVE_INVITE_USER_SUCCESS: 'ADMIN_RECEIVE_INVITE_USER_SUCCESS',
    ADMIN_RECEIVE_INVITE_USER_ERROR: 'ADMIN_RECEIVE_INVITE_USER_ERROR',

    ADMIN_REQUEST_ACCEPT_INVITE: 'ADMIN_REQUEST_ACCEPT_INVITE',
    ADMIN_RECEIVE_ACCEPT_INVITE_SUCCESS: 'ADMIN_RECEIVE_ACCEPT_INVITE_SUCCESS',
    ADMIN_RECEIVE_ACCEPT_INVITE_ERROR: 'ADMIN_RECEIVE_ACCEPT_INVITE_ERROR',
};

function requestAcceptInvite() {
    return {
        type: ActionTypes.ADMIN_REQUEST_ACCEPT_INVITE
    };
}

function receiveAcceptInviteSuccess(result) {
    return {
        type: ActionTypes.ADMIN_RECEIVE_ACCEPT_INVITE_SUCCESS,
        first_time: result.first_time,
        email: result.email,
        receivedAt: Date.now()
    };
}

function receiveAcceptInviteError(error) {
    return {
        type: ActionTypes.ADMIN_RECEIVE_ACCEPT_INVITE_ERROR,
        error,
        receivedAt: Date.now()
    };
}

export const Actions = {

    inviteUser: (email) => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.ADMIN_REQUEST_INVITE_USER });

            return ApiClient.inviteUser(email)
                .then(
                    () => {
                        toast.success('User was invited successfully');
                        dispatch({ type: ActionTypes.ADMIN_RECEIVE_INVITE_USER_SUCCESS });
                    },
                    error => {
                        toast.error(`User invitation error: ${error}`, { autoClose: false });
                        dispatch({ type: ActionTypes.ADMIN_RECEIVE_INVITE_USER_ERROR });
                    });
        }
    },

    acceptInvite: (invite_id) => {
        return (dispatch) => {

            dispatch(requestAcceptInvite());

            return ApiClient.acceptInvite(invite_id)
                .then(
                    response => {
                        const result = response.data;
                        dispatch(receiveAcceptInviteSuccess(result));

                        if (result.first_time) {
                            CognitoUtil.redirectToSignup();
                        }
                        else {
                            history.push(Url.home());
                        }
                    },
                    error => {
                        dispatch(receiveAcceptInviteError(error));
                    }
                );
        };
    },
}

export const Selectors = {
    isInvitingUser: (state) => { return state.admin.isInvitingUser; },

    isAcceptingInvite: (state) => { return state.admin.isAcceptingInvite; },
    acceptInviteResult: (state) => { return state.admin.acceptInviteResult; },
}

const initialState = {
    isInvitingUser: false,
    isAcceptingInvite: false,
};

export const Reducers = {

    admin: (state = initialState, action = {}) => {
        switch (action.type) {

            case ActionTypes.ADMIN_REQUEST_INVITE_USER:
                return Object.assign({}, state, {
                    isInvitingUser: true
                });

            case ActionTypes.ADMIN_RECEIVE_INVITE_USER_SUCCESS:
                return Object.assign({}, state, {
                    isInvitingUser: false,
                });

            case ActionTypes.ADMIN_RECEIVE_INVITE_USER_ERROR:
                return Object.assign({}, state, {
                    isInvitingUser: false,
                });

            case ActionTypes.ADMIN_REQUEST_ACCEPT_INVITE:
                return Object.assign({}, state, {
                    isAcceptingInvite: true
                });

            case ActionTypes.ADMIN_RECEIVE_ACCEPT_INVITE_SUCCESS:
                return Object.assign({}, state, {
                    isAcceptingInvite: false,
                    acceptInviteResult: {
                        first_time: action.first_time,
                        email: action.email,
                        code: ErrorCodes.SUCCESS
                    }
                });

            case ActionTypes.ADMIN_RECEIVE_ACCEPT_INVITE_ERROR:
                return Object.assign({}, state, {
                    isAcceptingInvite: false,
                    acceptInviteResult: {
                        code: ErrorCodes.ERROR,
                    }
                });

            default:
                return state;
        }
    }
};
