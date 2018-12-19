export const ActionTypes = {
    PROFILE_EDIT: 'PROFILE_EDIT',
    PROFILE_VIEW: 'PROFILE_VIEW',
}

export const ProfileViews = {
    EDIT: 'EDIT',
    VIEW: 'VIEW'
}

export const Actions = {

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
}

export const Selectors = {
    currentView: (state) => state.profile.currentView,
    currentUser: (state) => state.currentUser.user
}

const initialState = {
    currentView: ProfileViews.EDIT,
};

export const Reducers = {

    profile: (state = initialState, action = {}) => {
        switch (action.type) {

            case ActionTypes.PROFILE_EDIT:
                return Object.assign({}, state, {
                    currentView: ProfileViews.EDIT,
                });

            case ActionTypes.PROFILE_VIEW:
                return Object.assign({}, state, {
                    currentView: ProfileViews.VIEW,
                });

            default:
                return state;
        }
    }
};
