import ApiClient from '../../services/ApiClient'
import CognitoUtil from '../../services/Cognito/CognitoUtil'
import ErrorCodes from '../../services/ErrorCodes'
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';

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

    CURRENT_USER_CHANGE_PHONE_VERIFICATION_CODE: 'CURRENT_USER_CHANGE_PHONE_VERIFICATION_CODE',

    PROFILE_EDIT: 'PROFILE_EDIT',
    PROFILE_VIEW: 'PROFILE_VIEW',
    PROFILE_CLEAR_RESULT: 'PROFILE_CLEAR_RESULT'
}

export const ProfileViews = {
    EDIT: 'EDIT',
    VIEW: 'VIEW'
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
                        dispatch(receiveSaveUserSuccess(user));
                    },
                    error => {
                        const err = error && error.response && error.response.data && error.response.data.error;
                        dispatch(receiveSaveUserError(err));
                    }
                );
        };
    },

    acceptTerms: (userId) => {
        return (dispatch, getState) => {

            dispatch(requestAcceptTerms());

            return ApiClient.acceptTerms(userId)
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
    },

    editProfile: () => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.PROFILE_EDIT });
        }
    },

    viewProfile: () => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.PROFILE_VIEW });
        }
    },

    changePhoneVerificationCode: (code) => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.CURRENT_USER_CHANGE_PHONE_VERIFICATION_CODE, code });
        }
    },

    sendPhoneVerificationCode: (phone, onSuccess) => {
        return (dispatch) => {

            const promise = new Promise((resolve, reject) => {

                const cognitoUser = CognitoUtil.getCognitoUser();
                cognitoUser.getSession((err, session) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                        return;
                    }

                    phone = phone.replace(/ /g, '');
                    const attributes = [
                        new CognitoUserAttribute({
                            Name: 'phone_number',
                            Value: phone
                        })
                    ];
                    cognitoUser.updateAttributes(attributes, (err, result) => {
                        if (err) {
                            console.error(err)
                            reject(err);
                            return;
                        }

                        cognitoUser.getAttributeVerificationCode('phone_number',
                            {
                                onSuccess: () => {
                                    console.log('success');
                                },
                                onFailure: (error) => {
                                    console.error(error);
                                    reject(error);
                                },
                                inputVerificationCode: (data) => {
                                    console.log(data);
                                    resolve(data);
                                }
                            });
                    });

                })

            });

            return promise.then(
                response => {
                    console.log(response);
                    onSuccess();
                },
                error => {
                    console.error(error);
                });
        }
    },

    verifyPhoneVerificationCode: (code, onSuccess) => {
        return (dispatch) => {

            const promise = new Promise((resolve, reject) => {

                const cognitoUser = CognitoUtil.getCognitoUser();
                cognitoUser.getSession((err, session) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                        return;
                    }

                    cognitoUser.verifyAttribute('phone_number', code,
                        {
                            onSuccess: (success) => {
                                console.log(success);
                                resolve(success);
                            },
                            onFailure: (error) => {
                                console.log(error);
                                reject(error);
                            }
                        });
                });
            });

            return promise.then(
                response => {
                    console.log(response);
                    onSuccess();
                },
                error => {
                    console.error(error);
                });
        }
    },

    clearResult: () => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.PROFILE_CLEAR_RESULT });
        }
    }
}

export const Selectors = {
    currentUser: (state) => state.currentUser.user,
    isLoading: (state) => state.currentUser.isLoading,
    isSaving: (state) => state.currentUser.isSaving,
    apiErrorCode: (state) => state.currentUser.apiErrorCode,
    apiError: (state) => state.currentUser.apiError,
    termsAccepted: (state) => state.currentUser.termsAccepted,
    isVerifyingPhone: (state) => state.currentUser.isVerifyingPhone,
    isVerifyingCode: (state) => state.currentUser.isVerifyingCode,
    phoneVerificationCode: (state) => state.currentUser.phoneVerificationCode,

    currentView: (state) => state.currentUser.currentView,
    result: (state) => state.currentUser.result,
}

const initialState = {
    isLoading: false,
    isSaving: false,
    currentView: ProfileViews.EDIT,
};

export const Reducers = {

    currentUser: (state = initialState, action = {}) => {
        switch (action.type) {

            case ActionTypes.REQUEST_CURRENT_USER:
                return Object.assign({}, state, {
                    isLoading: true,
                    apiError: undefined
                });

            case ActionTypes.RECEIVE_CURRENT_USER_SUCCESS:
                return Object.assign({}, state, {
                    isLoading: false,
                    user: action.user,
                });

            case ActionTypes.RECEIVE_CURRENT_USER_ERROR:
                return Object.assign({}, state, {
                    isLoading: false,
                    apiError: action.apiError,
                    apiErrorCode: ErrorCodes.USER_DOES_NOT_EXIST,
                });

            case ActionTypes.CURRENT_USER_LOGOUT:
                return Object.assign({}, state, {
                    isLoading: false,
                    user: undefined
                });



            case ActionTypes.REQUEST_SAVE_USER:
                return Object.assign({}, state, {
                    isSaving: true,
                    apiError: undefined
                });

            case ActionTypes.RECEIVE_SAVE_USER_SUCCESS:
                return Object.assign({}, state, {
                    isSaving: false,
                    user: action.user,
                    result: {
                        code: ErrorCodes.SUCCESS
                    }
                });

            case ActionTypes.RECEIVE_SAVE_USER_ERROR:
                return Object.assign({}, state, {
                    isSaving: false,
                    apiError: action.apiError,
                    result: {
                        code: ErrorCodes.ERROR,
                        message: JSON.stringify(action.apiError)
                    }
                });

            case ActionTypes.REQUEST_ACCEPT_TERMS:
                return Object.assign({}, state, {
                    isSaving: true,
                    apiError: undefined
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

            case ActionTypes.CURRENT_USER_CHANGE_PHONE_VERIFICATION_CODE:
                return Object.assign({}, state, {
                    phoneVerificationCode: action.code,
                });

            case ActionTypes.PROFILE_EDIT:
                return Object.assign({}, state, {
                    currentView: ProfileViews.EDIT,
                });

            case ActionTypes.PROFILE_VIEW:
                return Object.assign({}, state, {
                    currentView: ProfileViews.VIEW,
                });

            case ActionTypes.PROFILE_CLEAR_RESULT:
                return Object.assign({}, state, {
                    result: undefined
                });

            default:
                return state;
        }
    }
};
