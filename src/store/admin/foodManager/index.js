import ApiClient from '../../../services/ApiClient'
import ApiObjectMapper from '../../../services/ApiObjectMapper'
import ErrorCodes from '../../../services/ErrorCodes'

const ActionTypes = {
    ADMIN_REQUEST_FOODS: 'ADMIN_REQUEST_FOODS',
    ADMIN_RECEIVE_FOODS_SUCCESS: 'ADMIN_RECEIVE_FOODS_SUCCESS',
    ADMIN_RECEIVE_FOODS_ERROR: 'ADMIN_RECEIVE_FOODS_ERROR',

    ADMIN_REQUEST_COOKS: 'ADMIN_REQUEST_COOKS',
    ADMIN_RECEIVE_COOKS_SUCCESS: 'ADMIN_RECEIVE_COOKS_SUCCESS',
    ADMIN_RECEIVE_COOKS_ERROR: 'ADMIN_RECEIVE_COOKS_ERROR',

    ADMIN_EDIT_FOOD: 'ADMIN_EDIT_FOOD',
};

export const Actions = {

    getFoods: () => {
        return (dispatch) => {

            dispatch({ type: ActionTypes.ADMIN_REQUEST_FOODS });

            return ApiClient.getFoods()
                .then(
                    response => {
                        let foods = ApiObjectMapper.mapFoods(response.data);
                        dispatch({
                            type: ActionTypes.ADMIN_RECEIVE_FOODS_SUCCESS,
                            foods: foods
                        });
                    },
                    error => {
                        dispatch({
                            type: ActionTypes.ADMIN_RECEIVE_FOODS_ERROR,
                            error
                        });
                    }
                );
        };
    },

    getCooks: (cookUserIds) => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.ADMIN_REQUEST_COOKS });

            return ApiClient.getCooks(cookUserIds)
                .then(
                    response => {
                        dispatch({
                            type: ActionTypes.ADMIN_RECEIVE_COOKS_SUCCESS,
                            cooks: response.data
                        });
                    },
                    error => {
                        dispatch({
                            type: ActionTypes.ADMIN_RECEIVE_COOKS_ERROR,
                            error
                        });
                    }
                );
        }
    },

    editFood: (food) => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.ADMIN_EDIT_FOOD, food });
        }
    }
}

export const Selectors = {
    isLoadingFoods: (state) => { return state.foodManager.isLoadingFoods; },
    getFoodsResult: (state) => { return state.foodManager.getFoodsResult; },
    foods: (state) => { return state.foodManager.foods; },

    isLoadingCooks: (state) => { return state.foodManager.isLoadingCooks; },
    getCooksResult: (state) => { return state.foodManager.getCooksResult; },
    cooks: (state) => { return state.foodManager.cooks; },

    food: (state) => { return state.foodManager.food; },
}

const initialState = {
    isLoadingFoods: false,
    isLoadingCooks: false,
};

export const Reducers = {

    foodManager: (state = initialState, action = {}) => {
        switch (action.type) {

            case ActionTypes.ADMIN_REQUEST_FOODS:
                return Object.assign({}, state, {
                    isLoadingFoods: true
                });

            case ActionTypes.ADMIN_RECEIVE_FOODS_SUCCESS:
                return Object.assign({}, state, {
                    isLoadingFoods: false,
                    foods: action.foods
                });

            case ActionTypes.ADMIN_RECEIVE_FOODS_ERROR:
                return Object.assign({}, state, {
                    isLoadingFoods: false,
                    getFoodsResult: {
                        code: ErrorCodes.ERROR,
                        message: JSON.stringify(action.error)
                    }
                });

            case ActionTypes.ADMIN_REQUEST_COOKS:
                return Object.assign({}, state, {
                    isLoadingCooks: true
                });

            case ActionTypes.ADMIN_RECEIVE_COOKS_SUCCESS:
                return Object.assign({}, state, {
                    isLoadingCooks: false,
                    cooks: action.cooks
                });

            case ActionTypes.ADMIN_RECEIVE_COOKS_ERROR:
                return Object.assign({}, state, {
                    isLoadingCooks: false,
                    getCooksResult: {
                        code: ErrorCodes.ERROR,
                        message: JSON.stringify(action.error)
                    }
                });
    
            case ActionTypes.ADMIN_EDIT_FOOD:
                return Object.assign({}, state, {
                    food: action.food
                });

            default:
                return state;
        }
    }
};
