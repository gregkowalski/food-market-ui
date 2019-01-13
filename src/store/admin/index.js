import ApiClient from '../../services/ApiClient'
import ErrorCodes from '../../services/ErrorCodes'
import Url from '../../services/Url'
import CognitoUtil from '../../services/Cognito/CognitoUtil'
import { history } from '../../History'

const ActionTypes = {
    ADMIN_REQUEST_INVITE_USER: 'ADMIN_REQUEST_INVITE_USER',
    ADMIN_RECEIVE_INVITE_USER_SUCCESS: 'ADMIN_RECEIVE_INVITE_USER_SUCCESS',
    ADMIN_RECEIVE_INVITE_USER_ERROR: 'ADMIN_RECEIVE_INVITE_USER_ERROR',

    ADMIN_REQUEST_ACCEPT_INVITE: 'ADMIN_REQUEST_ACCEPT_INVITE',
    ADMIN_RECEIVE_ACCEPT_INVITE_SUCCESS: 'ADMIN_RECEIVE_ACCEPT_INVITE_SUCCESS',
    ADMIN_RECEIVE_ACCEPT_INVITE_ERROR: 'ADMIN_RECEIVE_ACCEPT_INVITE_ERROR',
};

function requestInviteUser() {
    return {
        type: ActionTypes.ADMIN_REQUEST_INVITE_USER
    };
}

function receiveInviteUserSuccess() {
    return {
        type: ActionTypes.ADMIN_RECEIVE_INVITE_USER_SUCCESS,
        receivedAt: Date.now()
    };
}

function receiveInviteUserError(error) {
    return {
        type: ActionTypes.ADMIN_RECEIVE_INVITE_USER_ERROR,
        error,
        receivedAt: Date.now()
    };
}

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

            dispatch(requestInviteUser());

            return ApiClient.inviteUser(email)
                .then(
                    response => {
                        dispatch(receiveInviteUserSuccess());
                    },
                    error => {
                        dispatch(receiveInviteUserError(error));
                    }
                );
        };
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
    inviteUserResult: (state) => { return state.admin.inviteUserResult; },

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
                    inviteUserResult: {
                        code: ErrorCodes.SUCCESS
                    }
                });

            case ActionTypes.ADMIN_RECEIVE_INVITE_USER_ERROR:
                return Object.assign({}, state, {
                    isInvitingUser: false,
                    inviteUserResult: {
                        code: ErrorCodes.ERROR,
                        message: JSON.stringify(action.error)
                    }
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
