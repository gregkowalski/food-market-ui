import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
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

    ADMIN_REQUEST_CONFIRM_CODE: 'ADMIN_REQUEST_CONFIRM_CODE',
    ADMIN_RECEIVE_CONFIRM_CODE_SUCCESS: 'ADMIN_RECEIVE_CONFIRM_CODE_SUCCESS',
    ADMIN_RECEIVE_CONFIRM_CODE_ERROR: 'ADMIN_RECEIVE_CONFIRM_CODE_ERROR',

    ADMIN_REQUEST_RESEND_CODE: 'ADMIN_REQUEST_RESEND_CODE',
    ADMIN_RECEIVE_RESEND_CODE_SUCCESS: 'ADMIN_RECEIVE_RESEND_CODE_SUCCESS',
    ADMIN_RECEIVE_RESEND_CODE_ERROR: 'ADMIN_RECEIVE_RESEND_CODE_ERROR',

    ADMIN_HIDE_RESULT: 'ADMIN_HIDE_RESULT',
};

const CognitoUserStatus = {
    CONFIRMED: 'CONFIRMED',
    UNCONFIRMED: 'UNCONFIRMED',
    ARCHIVED: 'ARCHIVED',
    COMPROMISED: 'COMPROMISED',
    UNKNOWN: 'UNKNOWN',
    RESET_REQUIRED: 'RESET_REQUIRED',
    FORCE_CHANGE_PASSWORD: 'FORCE_CHANGE_PASSWORD',
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
        user_status: result.user_status,
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

function requestConfirmCode() {
    return {
        type: ActionTypes.ADMIN_REQUEST_CONFIRM_CODE
    };
}

function receiveConfirmCodeSuccess(result) {
    return {
        type: ActionTypes.ADMIN_RECEIVE_CONFIRM_CODE_SUCCESS,
        result,
        receivedAt: Date.now()
    };
}

function receiveConfirmCodeError(result) {
    return {
        type: ActionTypes.ADMIN_RECEIVE_CONFIRM_CODE_ERROR,
        result,
        receivedAt: Date.now()
    };
}


function requestResendCode() {
    return {
        type: ActionTypes.ADMIN_REQUEST_RESEND_CODE
    };
}

function receiveResendCodeSuccess(result) {
    return {
        type: ActionTypes.ADMIN_RECEIVE_RESEND_CODE_SUCCESS,
        result,
        receivedAt: Date.now()
    };
}

function receiveResendCodeError(result) {
    return {
        type: ActionTypes.ADMIN_RECEIVE_RESEND_CODE_ERROR,
        result,
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
                        else if (result.user_status === CognitoUserStatus.UNCONFIRMED) {
                            history.push(Url.confirmEmail());
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

    confirmCode: (code) => {
        return (dispatch, getState) => {

            const promise = new Promise((resolve, reject) => {
                const acceptInviteResult = Selectors.acceptInviteResult(getState());

                const userPool = new CognitoUserPool(CognitoUtil.getUserPoolData());
                var userData = {
                    Pool: userPool,
                    Username: acceptInviteResult.email
                };

                var cognitoUser = new CognitoUser(userData);

                cognitoUser.confirmRegistration(code, true, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });

            dispatch(requestConfirmCode());

            return promise.then(
                response => {
                    dispatch(receiveConfirmCodeSuccess());
                    CognitoUtil.redirectToLogin();
                },
                error => {
                    dispatch(receiveConfirmCodeError({
                        header: 'Confirmation Error',
                        content: error.message,
                        show: true,
                        isError: true
                    }));
                }
            );
        }
    },

    resendCode: () => {
        return (dispatch, getState) => {
            const promise = new Promise((resolve, reject) => {
                const acceptInviteResult = Selectors.acceptInviteResult(getState());

                const userPool = new CognitoUserPool(CognitoUtil.getUserPoolData());
                var userData = {
                    Pool: userPool,
                    Username: acceptInviteResult.email
                };

                var cognitoUser = new CognitoUser(userData);
                cognitoUser.resendConfirmationCode((err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });

            dispatch(requestResendCode());

            return promise.then(
                response => {
                    dispatch(receiveResendCodeSuccess({
                        header: 'Resend Success',
                        content: 'Verification code sent successfully.  Please check your email.',
                        show: true,
                        isError: false
                    }));
                },
                error => {
                    dispatch(receiveResendCodeError({
                        header: 'Resend Error',
                        content: 'Unable to send verification code.  Please contact support@foodcraft.ca for help.',
                        show: true,
                        isError: true
                    }));
                }
            );
        }
    },

    hideResult: () => {
        return (dispatch) => {
            dispatch({
                type: ActionTypes.ADMIN_HIDE_RESULT,
            })
        }
    }
}

export const Selectors = {
    isInvitingUser: (state) => { return state.admin.isInvitingUser; },
    inviteUserResult: (state) => { return state.admin.inviteUserResult; },

    isAcceptingInvite: (state) => { return state.admin.isAcceptingInvite; },
    acceptInviteResult: (state) => { return state.admin.acceptInviteResult; },

    isConfirmingCode: (state) => { return state.admin.isConfirmingCode; },
    isResendingCode: (state) => { return state.admin.isResendingCode; },
    result: (state) => { return state.admin.result; },
}

const initialState = {
    isInvitingUser: false,
    isAcceptingInvite: false,
    isConfirmingCode: false,
    isResendingCode: false,
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
                        user_status: action.user_status,
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

            case ActionTypes.ADMIN_REQUEST_CONFIRM_CODE:
                return Object.assign({}, state, {
                    isConfirmingCode: true
                });

            case ActionTypes.ADMIN_RECEIVE_CONFIRM_CODE_SUCCESS:
                return Object.assign({}, state, {
                    isConfirmingCode: false,
                    result: action.result,
                });

            case ActionTypes.ADMIN_RECEIVE_CONFIRM_CODE_ERROR:
                return Object.assign({}, state, {
                    isConfirmingCode: false,
                    result: action.result,
                });

            case ActionTypes.ADMIN_REQUEST_RESEND_CODE:
                return Object.assign({}, state, {
                    isResendingCode: true
                });

            case ActionTypes.ADMIN_RECEIVE_RESEND_CODE_SUCCESS:
                return Object.assign({}, state, {
                    isResendingCode: false,
                    result: action.result,
                });

            case ActionTypes.ADMIN_RECEIVE_RESEND_CODE_ERROR:
                return Object.assign({}, state, {
                    isResendingCode: false,
                    result: action.result,
                });

            case ActionTypes.ADMIN_HIDE_RESULT:
                return Object.assign({}, state, {
                    result: { show: false }
                });

            default:
                return state;
        }
    }
};
