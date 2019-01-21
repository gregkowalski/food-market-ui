import ApiClient from '../../services/ApiClient'
import CognitoUtil from '../../services/Cognito/CognitoUtil'
import { toast } from 'react-toastify'

export const ActionTypes = {
    PROFILE_REQUEST_SAVE_USER: 'PROFILE_REQUEST_SAVE_USER',
    PROFILE_RECEIVE_SAVE_USER_SUCCESS: 'PROFILE_RECEIVE_SAVE_USER_SUCCESS',
    PROFILE_RECEIVE_SAVE_USER_ERROR: 'PROFILE_RECEIVE_SAVE_USER_ERROR',

    PROFILE_EDIT: 'PROFILE_EDIT',
    PROFILE_VIEW: 'PROFILE_VIEW',

    PROFILE_SHOW_CHANGE_PHONE_VIEW: 'PROFILE_SHOW_CHANGE_PHONE_VIEW',
    PROFILE_HIDE_CHANGE_PHONE_VIEW: 'PROFILE_HIDE_CHANGE_PHONE_VIEW',

    PROFILE_CHANGE_PHONE_TEXT: 'PROFILE_CHANGE_PHONE_TEXT',
    PROFILE_CHANGE_CODE_TEXT: 'PROFILE_CHANGE_CODE_TEXT',

    PROFILE_SEND_CODE: 'PROFILE_SEND_CODE',
    PROFILE_SEND_CODE_SUCCESS: 'PROFILE_SEND_CODE_SUCCESS',
    PROFILE_SEND_CODE_ERROR: 'PROFILE_SEND_CODE_ERROR',

    PROFILE_VERIFY_CODE: 'PROFILE_VERIFY_CODE',
    PROFILE_VERIFY_CODE_SUCCESS: 'PROFILE_VERIFY_CODE_SUCCESS',
    PROFILE_VERIFY_CODE_ERROR: 'PROFILE_VERIFY_CODE_ERROR',
}

export const ProfileViews = {
    EDIT: 'EDIT',
    VIEW: 'VIEW'
}

export const Actions = {

    saveUser: (user) => {
        return (dispatch) => {

            dispatch({ type: ActionTypes.PROFILE_REQUEST_SAVE_USER });

            return ApiClient.saveUser(user)
                .then(
                    () => {
                        dispatch({ type: ActionTypes.PROFILE_RECEIVE_SAVE_USER_SUCCESS, user });
                        toast.success('Profile saved successfully');
                    },
                    error => {
                        const err = error && error.response && error.response.data && error.response.data.error;
                        dispatch({ type: ActionTypes.PROFILE_RECEIVE_SAVE_USER_ERROR });
                        toast.error(`Profile not saved: ${err}`, { autoClose: false });
                    }
                );
        };
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

    sendPhoneVerificationCode: (phone, showSuccessToast) => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.PROFILE_SEND_CODE });

            return CognitoUtil.sendPhoneVerificationCode(phone).then(
                () => {
                    dispatch({ type: ActionTypes.PROFILE_SEND_CODE_SUCCESS });
                    if (showSuccessToast) {
                        toast.success(`Verification code sent successfully to ${phone}`);
                    }
                },
                error => {
                    dispatch({ type: ActionTypes.PROFILE_SEND_CODE_ERROR });
                    toast.error(`Unable to send verification code to ${phone}: ${error && error.message}`, { autoClose: false });
                });
        }
    },

    verifyPhoneVerificationCode: (code) => {
        return (dispatch, getState) => {

            dispatch({ type: ActionTypes.PROFILE_VERIFY_CODE });

            const phone = Selectors.phone(getState());
            return CognitoUtil.verifyPhoneVerificationCode(code)
                .then(() => {
                    return ApiClient.saveUser({ phone, phone_verified: true });
                })
                .then(() => {
                    dispatch({ type: ActionTypes.PROFILE_VERIFY_CODE_SUCCESS, phone, phone_verified: true });
                    toast.success(`Phone updated successfully`);
                })
                .catch(error => {
                    console.error(error)
                    dispatch({ type: ActionTypes.PROFILE_VERIFY_CODE_ERROR });
                    toast.error(`Unable to verify code: ${error && error.message}`, { autoClose: false });
                })
        }
    },

    showChangePhoneView: () => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.PROFILE_SHOW_CHANGE_PHONE_VIEW });
        }
    },

    hideChangePhoneView: () => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.PROFILE_HIDE_CHANGE_PHONE_VIEW });
        }
    },

    changePhoneText: (phone) => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.PROFILE_CHANGE_PHONE_TEXT, phone });
        }
    },

    changeCodeText: (code) => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.PROFILE_CHANGE_CODE_TEXT, code });
        }
    },
}

export const Selectors = {
    isSavingProfile: (state) => state.profile.isSavingProfile,
    currentView: (state) => state.profile.currentView,
    showChangePhoneView: (state) => state.profile.showChangePhoneView,

    showCodeVerificationView: (state) => state.profile.showCodeVerificationView,
    phone: (state) => state.profile.phone,
    code: (state) => state.profile.code,
    isSendingCode: (state) => state.profile.isSendingCode,
    isVerifyingCode: (state) => state.profile.isVerifyingCode,
}

const initialState = {
    isSavingProfile: false,
    currentView: ProfileViews.EDIT,
    showChangePhoneView: false,

    showCodeVerificationView: false,
    phone: '',
    code: '',
    isSendingCode: false,
    isVerifyingCode: false,
};

export const Reducers = {

    profile: (state = initialState, action = {}) => {
        switch (action.type) {

            case ActionTypes.PROFILE_REQUEST_SAVE_USER:
                return Object.assign({}, state, {
                    isSavingProfile: true,
                });

            case ActionTypes.PROFILE_RECEIVE_SAVE_USER_SUCCESS:
                return Object.assign({}, state, {
                    isSavingProfile: false,
                });

            case ActionTypes.PROFILE_RECEIVE_SAVE_USER_ERROR:
                return Object.assign({}, state, {
                    isSavingProfile: false,
                });



            case ActionTypes.PROFILE_EDIT:
                return Object.assign({}, state, {
                    currentView: ProfileViews.EDIT,
                });

            case ActionTypes.PROFILE_VIEW:
                return Object.assign({}, state, {
                    currentView: ProfileViews.VIEW,
                });



            case ActionTypes.PROFILE_SHOW_CHANGE_PHONE_VIEW:
                return Object.assign({}, state, {
                    showChangePhoneView: true
                });

            case ActionTypes.PROFILE_HIDE_CHANGE_PHONE_VIEW:
                return Object.assign({}, state, {
                    showChangePhoneView: false
                });



            case ActionTypes.PROFILE_CHANGE_PHONE_TEXT:
                return Object.assign({}, state, {
                    phone: action.phone
                });

            case ActionTypes.PROFILE_CHANGE_CODE_TEXT:
                return Object.assign({}, state, {
                    code: action.code
                });




            case ActionTypes.PROFILE_SEND_CODE:
                return Object.assign({}, state, {
                    isSendingCode: true
                });

            case ActionTypes.PROFILE_SEND_CODE_SUCCESS:
                return Object.assign({}, state, {
                    isSendingCode: false,
                    showCodeVerificationView: true
                });

            case ActionTypes.PROFILE_SEND_CODE_ERROR:
                return Object.assign({}, state, {
                    isSendingCode: false,
                });



            case ActionTypes.PROFILE_VERIFY_CODE:
                return Object.assign({}, state, {
                    isVerifyingCode: true
                });

            case ActionTypes.PROFILE_VERIFY_CODE_SUCCESS:
                return Object.assign({}, state, {
                    isVerifyingCode: false,
                    showCodeVerificationView: false,
                    showChangePhoneView: false,
                    phone: '',
                    code: ''
                });

            case ActionTypes.PROFILE_VERIFY_CODE_ERROR:
                return Object.assign({}, state, {
                    isVerifyingCode: false,
                });

            default:
                return state;
        }
    }
};
