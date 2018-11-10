const ActionTypes = {
    GOOGLE_API_SCRIPT_TAG_ADDED: 'GOOGLE_API_SCRIPT_TAG_ADDED',
    GOOGLE_API_LOADED: 'GOOGLE_API_LOADED'
};

export const Actions = {

    loadGoogleApi: (apiKey) => {
        return (dispatch, getState) => {

            // Ensure we load the script tag only once!
            if (Selectors.tagAdded(getState())) {
                return;
            }

            dispatch({ type: ActionTypes.GOOGLE_API_SCRIPT_TAG_ADDED });

            const tag = window.document.createElement('script');
            tag.type = 'text/javascript';
            tag.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
            window.document.head.append(tag);
            tag.onload = () => {
                dispatch({
                    type: ActionTypes.GOOGLE_API_LOADED,
                    google: window.google
                });
            }
        }
    }
}

export const Selectors = {
    google: (state) => state.google.google,
    tagAdded: (state) => state.google.tagAdded
}

const initialState = {
    tagAdded: false
};

export const Reducers = {

    google: (state = initialState, action = {}) => {
        switch (action.type) {

            case ActionTypes.GOOGLE_API_SCRIPT_TAG_ADDED:
                return Object.assign({}, state, {
                    tagAdded: true
                });

            case ActionTypes.GOOGLE_API_LOADED:
                return Object.assign({}, state, {
                    google: action.google
                });

            default:
                return state;
        }
    }
};
