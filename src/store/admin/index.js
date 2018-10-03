import ApiClient from '../../services/ApiClient'
import ErrorCodes from '../../services/ErrorCodes'

const ActionTypes = {
    ADMIN_REQUEST_INVITE_USER: 'ADMIN_REQUEST_INVITE_USER',
    ADMIN_RECEIVE_INVITE_USER_SUCCESS: 'ADMIN_RECEIVE_INVITE_USER_SUCCESS',
    ADMIN_RECEIVE_INVITE_USER_ERROR: 'ADMIN_RECEIVE_INVITE_USER_ERROR'
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
}

export const Selectors = {
    isInvitingUser: (state) => { return state.admin.isInvitingUser; },
    inviteUserResult: (state) => { return state.admin.inviteUserResult; },
}

const initialState = {
    isInvitingUser: false,
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
                        message: action.error
                    }
                });

            default:
                return state;
        }
    }
};
