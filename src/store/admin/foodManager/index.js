import ApiClient from '../../../services/ApiClient'
import ApiObjectMapper from '../../../services/ApiObjectMapper'
import ErrorCodes from '../../../services/ErrorCodes'
import Util from '../../../services/Util';

const ActionTypes = {
    ADMIN_REQUEST_FOODS: 'ADMIN_REQUEST_FOODS',
    ADMIN_RECEIVE_FOODS_SUCCESS: 'ADMIN_RECEIVE_FOODS_SUCCESS',
    ADMIN_RECEIVE_FOODS_ERROR: 'ADMIN_RECEIVE_FOODS_ERROR',

    ADMIN_REQUEST_COOKS: 'ADMIN_REQUEST_COOKS',
    ADMIN_RECEIVE_COOKS_SUCCESS: 'ADMIN_RECEIVE_COOKS_SUCCESS',
    ADMIN_RECEIVE_COOKS_ERROR: 'ADMIN_RECEIVE_COOKS_ERROR',

    ADMIN_EDIT_FOOD: 'ADMIN_EDIT_FOOD',
    ADMIN_ADD_INGREDIENT_OPTION: 'ADMIN_ADD_INGREDIENT_OPTION',
    ADMIN_ADD_IMAGE_URL_OPTION: 'ADMIN_ADD_IMAGE_URL_OPTION',

    ADMIN_REQUEST_SAVE_FOOD: 'ADMIN_REQUEST_SAVE_FOOD',
    ADMIN_RECEIVE_SAVE_FOOD_SUCCESS: 'ADMIN_RECEIVE_SAVE_FOOD_SUCCESS',
    ADMIN_RECEIVE_SAVE_FOOD_ERROR: 'ADMIN_RECEIVE_SAVE_FOOD_ERROR',

    ADMIN_CLEAR_SAVE_FOOD_RESULT: 'ADMIN_CLEAR_SAVE_FOOD_RESULT'
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
        return (dispatch, getState) => {
            dispatch({ type: ActionTypes.ADMIN_REQUEST_COOKS });

            return ApiClient.getUsers(cookUserIds)
                .then(
                    response => {
                        const foods = Selectors.foods(getState());
                        const cooks = response.data;

                        dispatch({ type: ActionTypes.ADMIN_RECEIVE_COOKS_SUCCESS, foods, cooks });
                    },
                    error => {
                        dispatch({ type: ActionTypes.ADMIN_RECEIVE_COOKS_ERROR, error });
                    }
                );
        }
    },

    editFood: (food_id) => {
        return (dispatch, getState) => {

            const foods = Selectors.foods(getState());
            if (foods) {
                const food = foods.find(f => f.food_id === food_id);

                const ingredientOptions = food.ingredients.map(f => {
                    return { key: f, value: f, text: f };
                });

                const imageUrlOptions = food.imageUrls.map(x => {
                    return { key: x, value: x, text: x };
                })

                dispatch({
                    type: ActionTypes.ADMIN_EDIT_FOOD,
                    food,
                    ingredientOptions,
                    imageUrlOptions
                });
            }

        }
    },

    addIngredientOption: (value) => {
        return (dispatch) => {

            const option = {
                key: value,
                text: value,
                value
            };
            dispatch({
                type: ActionTypes.ADMIN_ADD_INGREDIENT_OPTION,
                option
            });
        }
    },

    addImageUrlOption: (value) => {
        return (dispatch) => {

            const option = {
                key: value,
                text: value,
                value
            };
            dispatch({
                type: ActionTypes.ADMIN_ADD_IMAGE_URL_OPTION,
                option
            });
        }
    },

    saveFood: (food) => {
        return (dispatch) => {

            dispatch({ type: ActionTypes.ADMIN_REQUEST_SAVE_FOOD });

            const foodDto = Object.assign({}, food, {
                handoff_dates: undefined
            });

            return ApiClient.saveFood(foodDto)
                .then(
                    response => {
                        dispatch({
                            type: ActionTypes.ADMIN_RECEIVE_SAVE_FOOD_SUCCESS,
                            food: foodDto
                        });
                    },
                    error => {
                        dispatch({
                            type: ActionTypes.ADMIN_RECEIVE_SAVE_FOOD_ERROR,
                            error: error.response.data.error
                        });
                    }
                );
        }
    },

    clearSaveFoodResult: (value) => {
        return (dispatch) => {

            const option = {
                key: value,
                text: value,
                value
            };
            dispatch({
                type: ActionTypes.ADMIN_CLEAR_SAVE_FOOD_RESULT,
                option
            });
        }
    },
}

export const Selectors = {
    isLoadingFoods: (state) => state.foodManager.isLoadingFoods,
    isSavingFood: (state) => state.foodManager.isSavingFood,
    getFoodsResult: (state) => state.foodManager.getFoodsResult,
    foods: (state) => state.foodManager.foods,
    saveFoodResult: (state) => state.foodManager.saveFoodResult,

    isLoadingCooks: (state) => state.foodManager.isLoadingCooks,
    getCooksResult: (state) => state.foodManager.getCooksResult,
    cooks: (state) => state.foodManager.cooks,

    food: (state) => state.foodManager.food,
    ingredientOptions: (state) => state.foodManager.ingredientOptions,
    imageUrlOptions: (state) => state.foodManager.imageUrlOptions,
}

const initialState = {
    isLoadingFoods: false,
    isLoadingCooks: false,
    isSavingFood: false,
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
                const cooks = {};
                action.cooks.forEach(x => cooks[x.user_id] = x);
                const foods = [];

                for (let i = 0; i < action.foods.length; i++) {
                    const food = Object.assign({}, action.foods[i]);
                    const cook = cooks[food.user_id];
                    food.cook = cook;
                    food.cook_name = Util.firstNonEmptyValue(cook.name, cook.username, cook.email);
                    foods.push(food);
                }

                return Object.assign({}, state, {
                    isLoadingCooks: false,
                    cooks: action.cooks,
                    foods: foods
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
                    food: action.food,
                    ingredientOptions: action.ingredientOptions,
                    imageUrlOptions: action.imageUrlOptions,
                });

            case ActionTypes.ADMIN_ADD_INGREDIENT_OPTION:
                return Object.assign({}, state,
                    {
                        ingredientOptions: [action.option, ...state.ingredientOptions]
                    });

            case ActionTypes.ADMIN_ADD_IMAGE_URL_OPTION:
                return Object.assign({}, state,
                    {
                        imageUrlOptions: [action.option, ...state.imageUrlOptions]
                    });

            case ActionTypes.ADMIN_REQUEST_SAVE_FOOD:
                return Object.assign({}, state, {
                    isSavingFood: true
                });

            case ActionTypes.ADMIN_RECEIVE_SAVE_FOOD_SUCCESS:
                return Object.assign({}, state, {
                    isSavingFood: false,
                    food: action.food,
                    saveFoodResult: {
                        code: ErrorCodes.SUCCESS
                    }
                });

            case ActionTypes.ADMIN_RECEIVE_SAVE_FOOD_ERROR:
                return Object.assign({}, state, {
                    isSavingFood: false,
                    saveFoodResult: {
                        code: ErrorCodes.ERROR,
                        message: JSON.stringify(action.error)
                    }
                });

            case ActionTypes.ADMIN_CLEAR_SAVE_FOOD_RESULT:
                return Object.assign({}, state, {
                    saveFoodResult: undefined
                });

            default:
                return state;
        }
    }
};
