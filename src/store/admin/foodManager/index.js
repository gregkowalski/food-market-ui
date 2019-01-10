import axios from 'axios'
import ApiClient from '../../../services/ApiClient'
import ApiObjectMapper from '../../../services/ApiObjectMapper'
import ErrorCodes from '../../../services/ErrorCodes'
import Util from '../../../services/Util'
import Url from '../../../services/Url'
import { FoodPrepTypes } from '../../../Enums';
import { Constants } from '../../../Constants';
import { history } from '../../../History'

const ActionTypes = {
    FOODMANAGER_REQUEST_FOODS: 'FOODMANAGER_REQUEST_FOODS',
    FOODMANAGER_RECEIVE_FOODS_SUCCESS: 'FOODMANAGER_RECEIVE_FOODS_SUCCESS',
    FOODMANAGER_RECEIVE_FOODS_ERROR: 'FOODMANAGER_RECEIVE_FOODS_ERROR',

    FOODMANAGER_EDIT_FOOD: 'FOODMANAGER_EDIT_FOOD',
    FOODMANAGER_ADD_INGREDIENT_OPTION: 'FOODMANAGER_ADD_INGREDIENT_OPTION',

    FOODMANAGER_REQUEST_SAVE_FOOD: 'FOODMANAGER_REQUEST_SAVE_FOOD',
    FOODMANAGER_RECEIVE_SAVE_FOOD_SUCCESS: 'FOODMANAGER_RECEIVE_SAVE_FOOD_SUCCESS',
    FOODMANAGER_RECEIVE_SAVE_FOOD_ERROR: 'FOODMANAGER_RECEIVE_SAVE_FOOD_ERROR',

    FOODMANAGER_CLEAR_SAVE_FOOD_RESULT: 'FOODMANAGER_CLEAR_SAVE_FOOD_RESULT',


    FOODMANAGER_SELECT_IMAGE: 'FOODMANAGER_SELECT_IMAGE',

    FOODMANAGER_REQUEST_UPLOAD_IMAGE: 'FOODMANAGER_REQUEST_UPLOAD_IMAGE',
    FOODMANAGER_UPLOAD_IMAGE_RECEIVE_SUCCESS: 'FOODMANAGER_UPLOAD_IMAGE_RECEIVE_SUCCESS',
    FOODMANAGER_UPLOAD_IMAGE_RECEIVE_ERROR: 'FOODMANAGER_UPLOAD_IMAGE_RECEIVE_ERROR',

    FOODMANAGER_REQUEST_DELETE_IMAGE: 'FOODMANAGER_REQUEST_DELETE_IMAGE',
    FOODMANAGER_DELETE_IMAGE_RECEIVE_SUCCESS: 'FOODMANAGER_DELETE_IMAGE_RECEIVE_SUCCESS',
    FOODMANAGER_DELETE_IMAGE_RECEIVE_ERROR: 'FOODMANAGER_DELETE_IMAGE_RECEIVE_ERROR',

    FOODMANAGER_LOAD_IMAGE_FILE: 'FOODMANAGER_LOAD_IMAGE_FILE',
    FOODMANAGER_CHANGE_IMAGE_CROP: 'FOODMANAGER_CHANGE_IMAGE_CROP',
    FOODMANAGER_CHANGE_CROPPED_IMAGE_URL: 'FOODMANAGER_CHANGE_CROPPED_IMAGE_URL',

    FOODMANAGER_REQUEST_DELETE_FOOD: 'FOODMANAGER_REQUEST_DELETE_FOOD',
    FOODMANAGER_RECEIVE_DELETE_FOOD_SUCCESS: 'FOODMANAGER_RECEIVE_DELETE_FOOD_SUCCESS',
    FOODMANAGER_RECEIVE_DELETE_FOOD_ERROR: 'FOODMANAGER_RECEIVE_DELETE_FOOD_ERROR',

    FOODMANAGER_OPEN_DELETE_FOOD_MODAL: 'FOODMANAGER_OPEN_DELETE_FOOD_MODAL',
    FOODMANAGER_CLOSE_DELETE_FOOD_MODAL: 'FOODMANAGER_CLOSE_DELETE_FOOD_MODAL',
    FOODMANAGER_DELETE_FOOD_CONFIRM_TEXT_CHANGE: 'FOODMANAGER_DELETE_FOOD_CONFIRM_TEXT_CHANGE',


    FOODMANAGER_ADD_FOOD_MODAL_OPEN: 'FOODMANAGER_ADD_FOOD_MODAL_OPEN',
    FOODMANAGER_ADD_FOOD_MODAL_CLOSE: 'FOODMANAGER_ADD_FOOD_MODAL_CLOSE',

    FOODMANAGER_ADD_FOOD_MODAL_SELECT_COOK: 'FOODMANAGER_ADD_FOOD_MODAL_SELECT_COOK',
    FOODMANAGER_ADD_FOOD_REQUEST: 'FOODMANAGER_ADD_FOOD_REQUEST',
    FOODMANAGER_ADD_FOOD_RECEIVE_SUCCESS: 'FOODMANAGER_ADD_FOOD_RECEIVE_SUCCESS',
    FOODMANAGER_ADD_FOOD_RECEIVE_ERROR: 'FOODMANAGER_ADD_FOOD_RECEIVE_ERROR',

    FOODMANAGER_CLEAR_FOOD_RESULT: 'FOODMANAGER_CLEAR_FOOD_RESULT',
};

export const Actions = {

    selectImage: (imageUrl) => {
        return (dispatch) => {
            if (!imageUrl) {
                return;
            }

            dispatch({ type: ActionTypes.FOODMANAGER_SELECT_IMAGE, imageUrl });
        }
    },

    deleteImage: (imageUrl, updateFormValueFunc) => {
        return (dispatch, getState) => {
            if (!imageUrl) {
                return;
            }

            // Don't attempt to delete legacy images such as /assets/images/my_food_image.png from AWS S3
            if (imageUrl.startsWith('/')) {
                updateFormValueFunc(imageUrl);
                dispatch({ type: ActionTypes.FOODMANAGER_DELETE_IMAGE_RECEIVE_SUCCESS, imageUrl });
                return;
            }

            dispatch({ type: ActionTypes.FOODMANAGER_REQUEST_DELETE_IMAGE });

            const food = Selectors.food(getState());
            const imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);

            return ApiClient.createSignedUrl('deleteObject', food.user_id, food.food_id, imageName)
                .then(
                    async response => {
                        const url = response.data.signedUrl;
                        const assetUrl = response.data.assetUrl;
                        try {
                            const data = await axios.delete(url)
                            console.log(data);

                            updateFormValueFunc(assetUrl);
                            dispatch({ type: ActionTypes.FOODMANAGER_DELETE_IMAGE_RECEIVE_SUCCESS, assetUrl });
                        }
                        catch (ex) {
                            dispatch({ type: ActionTypes.FOODMANAGER_DELETE_IMAGE_RECEIVE_ERROR, error: ex });
                        }
                    },
                    error => {
                        dispatch({ type: ActionTypes.FOODMANAGER_DELETE_IMAGE_RECEIVE_ERROR, error });
                    })
        }
    },

    uploadImage: (imageUrl, imageBlob, updateFormValueFunc) => {
        return (dispatch, getState) => {
            if (!imageUrl || !imageBlob) {
                return;
            }

            dispatch({ type: ActionTypes.FOODMANAGER_REQUEST_UPLOAD_IMAGE });

            const food = Selectors.food(getState());
            const imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1) + '.' + imageBlob.type.substring(imageBlob.type.lastIndexOf('/') + 1);
            return ApiClient.createSignedUrl('putObject', food.user_id, food.food_id, imageName)
                .then(
                    async (response) => {
                        const url = response.data.signedUrl;
                        const assetUrl = response.data.assetUrl;
                        try {
                            await axios.put(url, imageBlob, {
                                headers: { 'Content-Type': imageBlob.type }
                            });

                            updateFormValueFunc(assetUrl);
                            dispatch({ type: ActionTypes.FOODMANAGER_UPLOAD_IMAGE_RECEIVE_SUCCESS, assetUrl });
                        }
                        catch (ex) {
                            dispatch({ type: ActionTypes.FOODMANAGER_UPLOAD_IMAGE_RECEIVE_ERROR, error: ex });
                        }
                    },
                    error => {
                        dispatch({ type: ActionTypes.FOODMANAGER_UPLOAD_IMAGE_RECEIVE_ERROR, error });
                    })
        }
    },

    getFoods: () => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.FOODMANAGER_REQUEST_FOODS });

            return ApiClient.getFoods()
                .then(
                    response => {
                        const foods = ApiObjectMapper.mapFoods(response.data);
                        const cook_ids = Util.distinct(foods.map(x => x.user_id));

                        return ApiClient.getPublicUsers(cook_ids)
                            .then(
                                response => {
                                    const cooks = response.data;
                                    dispatch({ type: ActionTypes.FOODMANAGER_RECEIVE_FOODS_SUCCESS, foods, cooks })
                                },
                                error => {
                                    dispatch({ type: ActionTypes.FOODMANAGER_RECEIVE_FOODS_ERROR, error });
                                }
                            );
                    },
                    error => {
                        dispatch({ type: ActionTypes.FOODMANAGER_RECEIVE_FOODS_ERROR, error });
                    }
                );
        };
    },

    editFood: (food_id) => {
        return (dispatch, getState) => {

            const state = getState();
            const foods = Selectors.foods(state);
            if (foods) {
                let food = foods.find(f => f.food_id === food_id);

                const ingredientOptions = food.ingredients.map(f => {
                    return { key: f, value: f, text: f };
                });

                dispatch({
                    type: ActionTypes.FOODMANAGER_EDIT_FOOD,
                    food,
                    ingredientOptions,
                });
            }

        }
    },

    addIngredientOption: (value) => {
        return (dispatch) => {

            const option = { key: value, text: value, value };
            dispatch({ type: ActionTypes.FOODMANAGER_ADD_INGREDIENT_OPTION, option });
        }
    },

    saveFood: (food) => {
        return (dispatch) => {

            dispatch({ type: ActionTypes.FOODMANAGER_REQUEST_SAVE_FOOD });

            const foodDto = Object.assign({}, food, {
                handoff_dates: undefined
            });

            return ApiClient.saveFood(foodDto)
                .then(
                    response => {
                        dispatch({
                            type: ActionTypes.FOODMANAGER_RECEIVE_SAVE_FOOD_SUCCESS,
                            food: foodDto
                        });
                    },
                    error => {
                        dispatch({
                            type: ActionTypes.FOODMANAGER_RECEIVE_SAVE_FOOD_ERROR,
                            error: error.response.data.error
                        });
                    }
                );
        }
    },

    clearSaveFoodResult: (value) => {
        return (dispatch) => {

            const option = { key: value, text: value, value };
            dispatch({ type: ActionTypes.FOODMANAGER_CLEAR_SAVE_FOOD_RESULT, option });
        }
    },

    loadImageFile: (imageSource) => {
        return (dispatch) => {
            dispatch({
                type: ActionTypes.FOODMANAGER_LOAD_IMAGE_FILE,
                imageSource
            });
        }
    },

    changeImageCrop: (imageCrop) => {
        return (dispatch) => {
            dispatch({
                type: ActionTypes.FOODMANAGER_CHANGE_IMAGE_CROP,
                imageCrop
            });
        }
    },

    changeCroppedImageUrl: (croppedImageUrl) => {
        return (dispatch) => {
            dispatch({
                type: ActionTypes.FOODMANAGER_CHANGE_CROPPED_IMAGE_URL,
                croppedImageUrl
            })
        }
    },

    deleteFood: (food_id) => {
        return (dispatch) => {

            dispatch({ type: ActionTypes.FOODMANAGER_REQUEST_DELETE_FOOD, food_id });

            return ApiClient.deleteFood(food_id)
                .then(
                    response => {
                        window.scrollTo(0, 0);
                        dispatch({
                            type: ActionTypes.FOODMANAGER_RECEIVE_DELETE_FOOD_SUCCESS,
                            food_id
                        });
                    },
                    error => {
                        window.scrollTo(0, 0);
                        dispatch({
                            type: ActionTypes.FOODMANAGER_RECEIVE_DELETE_FOOD_ERROR,
                            error: error.response.data.error
                        });
                    }
                );
        }
    },

    clearResult: () => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.FOODMANAGER_CLEAR_FOOD_RESULT });
        }
    },

    openDeleteFoodModal: (food_id) => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.FOODMANAGER_OPEN_DELETE_FOOD_MODAL, food_id });
        }
    },

    closeDeleteFoodModal: () => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.FOODMANAGER_CLOSE_DELETE_FOOD_MODAL });
        }
    },

    changeDeleteFoodConfirmText: (text) => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.FOODMANAGER_DELETE_FOOD_CONFIRM_TEXT_CHANGE, text });
        }
    },

    openAddFoodModal: () => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.FOODMANAGER_ADD_FOOD_MODAL_OPEN });
        }
    },

    closeAddFoodModal: () => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.FOODMANAGER_ADD_FOOD_MODAL_CLOSE });
        }
    },

    addFoodModalSelectCook: (cook_id) => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.FOODMANAGER_ADD_FOOD_MODAL_SELECT_COOK, cook_id });
        }
    },

    addFood: (cook_id) => {
        return (dispatch, getState) => {
            const food = {
                user_id: cook_id,
                title: 'Delicious snack',
                imageUrls: ['/assets/images/new-food.png'],
                ingredients: ['taste'],
                short_description: 'This snack is delicious',
                long_description: 'This snack is amazing',
                price: 10,
                price_currency: Constants.Currency,
                features: [],
                unit: '1 unit',
                feed: '1',
                states: [FoodPrepTypes.cooked],
                allergies: [],
                pickup: true,
                delivery: false,
                regions: [],
                position: {
                    lat: 49.2609098,
                    lng: -123.114073
                },
                hidden: true,
                handoff_dates: undefined,
            };

            const cooks = Selectors.cooks(getState());
            const cook = cooks.find(x => x.user_id === cook_id);
            food.cook_name = Util.firstNonEmptyValue(cook.name, cook.username, cook.email);
            food.cook = cook;

            dispatch({ type: ActionTypes.FOODMANAGER_ADD_FOOD_REQUEST });

            return ApiClient.createFood(food)
                .then(
                    response => {
                        food.food_id = response.data.food_id;
                        dispatch({
                            type: ActionTypes.FOODMANAGER_ADD_FOOD_RECEIVE_SUCCESS,
                            food
                        });
                        history.push(Url.admin.manageFood(food.food_id));
                    },
                    error => {
                        dispatch({
                            type: ActionTypes.FOODMANAGER_ADD_FOOD_RECEIVE_ERROR,
                            error: error.response.data.error
                        });
                        window.scrollTo(0, 0);
                    }
                );
        }
    },
}

export const Selectors = {
    isLoadingFoods: (state) => state.foodManager.isLoadingFoods,
    isSavingFood: (state) => state.foodManager.isSavingFood,
    getFoodsResult: (state) => state.foodManager.getFoodsResult,
    foods: (state) => state.foodManager.foods,
    saveFoodResult: (state) => state.foodManager.saveFoodResult,

    cooks: (state) => state.foodManager.cooks,

    food: (state) => state.foodManager.food,
    ingredientOptions: (state) => state.foodManager.ingredientOptions,
    selectedImageUrl: (state) => state.foodManager.selectedImageUrl,
    cookOptions: (state) => state.foodManager.cookOptions,

    isUploadingImage: (state) => state.foodManager.isUploadingImage,
    uploadImageResult: (state) => state.foodManager.uploadImageResult,
    isDeletingImage: (state) => state.foodManager.isDeletingImage,
    deleteImageResult: (state) => state.foodManager.deleteImageResult,

    imageSource: (state) => state.foodManager.imageSource,
    imageCrop: (state) => state.foodManager.imageCrop,
    croppedImageUrl: (state) => state.foodManager.croppedImageUrl,

    deleteModalFoodId: (state) => state.foodManager.deleteModalFoodId,
    deletingFoodId: (state) => state.foodManager.deletingFoodId,
    result: (state) => state.foodManager.result,
    deleteFoodConfirmText: (state) => state.foodManager.deleteFoodConfirmText,

    isAddFoodModalOpen: (state) => state.foodManager.isAddFoodModalOpen,
    addFoodCookId: (state) => state.foodManager.addFoodCookId,

    isAddingFood: (state) => state.foodManager.isAddingFood,
}

const initialState = {
    isLoadingFoods: false,
    isSavingFood: false,
    isUploadingImage: false,
    isDeletingImage: false,
    imageCrop: {
        x: 10,
        y: 10,
        aspect: 3 / 2,
    },
    deleteFoodConfirmText: ''
};

export const Reducers = {

    foodManager: (state = initialState, action = {}) => {
        switch (action.type) {

            case ActionTypes.FOODMANAGER_REQUEST_FOODS:
                return Object.assign({}, state, {
                    isLoadingFoods: true
                });

            case ActionTypes.FOODMANAGER_RECEIVE_FOODS_SUCCESS:
                {
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

                    const cookOptions = action.cooks.map(cook => {
                        return {
                            key: cook.user_id,
                            value: cook.user_id,
                            text: Util.firstNonEmptyValue(cook.name, cook.username, cook.email)
                        };
                    });

                    return Object.assign({}, state, {
                        isLoadingFoods: false,
                        foods: foods,
                        cooks: action.cooks,
                        cookOptions
                    });
                }
            case ActionTypes.FOODMANAGER_RECEIVE_FOODS_ERROR:
                return Object.assign({}, state, {
                    isLoadingFoods: false,
                    getFoodsResult: {
                        code: ErrorCodes.ERROR,
                        message: JSON.stringify(action.error)
                    }
                });

            case ActionTypes.FOODMANAGER_EDIT_FOOD:
                return Object.assign({}, state, {
                    food: action.food,
                    ingredientOptions: action.ingredientOptions,
                });

            case ActionTypes.FOODMANAGER_ADD_INGREDIENT_OPTION:
                return Object.assign({}, state,
                    {
                        ingredientOptions: [action.option, ...state.ingredientOptions]
                    });

            case ActionTypes.FOODMANAGER_REQUEST_SAVE_FOOD:
                return Object.assign({}, state, {
                    isSavingFood: true
                });

            case ActionTypes.FOODMANAGER_RECEIVE_SAVE_FOOD_SUCCESS:
                {
                    const food = action.food;
                    let foods = state.foods;
                    const index = foods.findIndex(f => f.food_id === food.food_id);
                    if (index >= 0) {
                        const newFoods = [...foods.slice(0, index), food, ...foods.slice(index + 1)];
                        foods = newFoods;
                    }

                    return Object.assign({}, state, {
                        isSavingFood: false,
                        food,
                        foods,
                        saveFoodResult: {
                            code: ErrorCodes.SUCCESS
                        }
                    });
                }
            case ActionTypes.FOODMANAGER_RECEIVE_SAVE_FOOD_ERROR:
                return Object.assign({}, state, {
                    isSavingFood: false,
                    saveFoodResult: {
                        code: ErrorCodes.ERROR,
                        message: JSON.stringify(action.error)
                    }
                });

            case ActionTypes.FOODMANAGER_CLEAR_SAVE_FOOD_RESULT:
                return Object.assign({}, state, {
                    saveFoodResult: undefined
                });

            case ActionTypes.FOODMANAGER_SELECT_IMAGE:
                return Object.assign({}, state, {
                    selectedImageUrl: action.imageUrl
                });

            case ActionTypes.FOODMANAGER_REQUEST_DELETE_IMAGE:
                return Object.assign({}, state, {
                    isDeletingImage: true
                });

            case ActionTypes.FOODMANAGER_DELETE_IMAGE_RECEIVE_ERROR:
                return Object.assign({}, state, {
                    isDeletingImage: false,
                    deleteImageResult: {
                        code: ErrorCodes.ERROR,
                        message: JSON.stringify(action.error)
                    }
                });

            case ActionTypes.FOODMANAGER_DELETE_IMAGE_RECEIVE_SUCCESS:
                return Object.assign({}, state, {
                    isDeletingImage: false,
                    selectedImageUrl: undefined,
                    deleteImageResult: {
                        code: ErrorCodes.SUCCESS,
                    }
                });

            case ActionTypes.FOODMANAGER_REQUEST_UPLOAD_IMAGE:
                return Object.assign({}, state, {
                    isUploadingImage: true,
                    imageCrop: initialState.imageCrop,
                    croppedImageUrl: undefined
                });

            case ActionTypes.FOODMANAGER_UPLOAD_IMAGE_RECEIVE_ERROR:
                return Object.assign({}, state, {
                    isUploadingImage: false,
                    uploadImageResult: {
                        code: ErrorCodes.ERROR,
                        message: JSON.stringify(action.error)
                    }
                });

            case ActionTypes.FOODMANAGER_UPLOAD_IMAGE_RECEIVE_SUCCESS:
                return Object.assign({}, state, {
                    isUploadingImage: false,
                    uploadImageResult: {
                        code: ErrorCodes.SUCCESS,
                    }
                });

            case ActionTypes.FOODMANAGER_LOAD_IMAGE_FILE:
                return Object.assign({}, state, {
                    imageSource: action.imageSource
                });

            case ActionTypes.FOODMANAGER_CHANGE_IMAGE_CROP:
                return Object.assign({}, state, {
                    imageCrop: action.imageCrop
                });

            case ActionTypes.FOODMANAGER_CHANGE_CROPPED_IMAGE_URL:
                return Object.assign({}, state, {
                    croppedImageUrl: action.croppedImageUrl
                });

            case ActionTypes.FOODMANAGER_REQUEST_DELETE_FOOD:
                return Object.assign({}, state, {
                    deletingFoodId: action.food_id,
                });

            case ActionTypes.FOODMANAGER_RECEIVE_DELETE_FOOD_SUCCESS:
                {
                    let foods = state.foods;
                    const index = foods.findIndex(f => f.food_id === action.food_id);
                    if (index >= 0) {
                        const newFoods = [...foods.slice(0, index), ...foods.slice(index + 1)];
                        foods = newFoods;
                    }

                    return Object.assign({}, state, {
                        deletingFoodId: undefined,
                        deleteModalFoodId: undefined,
                        result: {
                            code: ErrorCodes.SUCCESS,
                        },
                        foods
                    });
                }

            case ActionTypes.FOODMANAGER_RECEIVE_DELETE_FOOD_ERROR:
                return Object.assign({}, state, {
                    deletingFoodId: undefined,
                    deleteModalFoodId: undefined,
                    result: {
                        code: ErrorCodes.ERROR,
                        message: JSON.stringify(action.error)
                    },
                });

            case ActionTypes.FOODMANAGER_CLEAR_FOOD_RESULT:
                return Object.assign({}, state, {
                    result: undefined,
                });

            case ActionTypes.FOODMANAGER_OPEN_DELETE_FOOD_MODAL:
                return Object.assign({}, state, {
                    deleteModalFoodId: action.food_id,
                    deleteFoodConfirmText: '',
                });

            case ActionTypes.FOODMANAGER_CLOSE_DELETE_FOOD_MODAL:
                return Object.assign({}, state, {
                    deleteModalFoodId: undefined,
                });

            case ActionTypes.FOODMANAGER_DELETE_FOOD_CONFIRM_TEXT_CHANGE:
                return Object.assign({}, state, {
                    deleteFoodConfirmText: action.text,
                });

            case ActionTypes.FOODMANAGER_ADD_FOOD_MODAL_OPEN:
                return Object.assign({}, state, {
                    isAddFoodModalOpen: true
                });

            case ActionTypes.FOODMANAGER_ADD_FOOD_MODAL_CLOSE:
                return Object.assign({}, state, {
                    isAddFoodModalOpen: false
                });

            case ActionTypes.FOODMANAGER_ADD_FOOD_MODAL_SELECT_COOK:
                return Object.assign({}, state, {
                    addFoodCookId: action.cook_id
                });

            case ActionTypes.FOODMANAGER_ADD_FOOD_REQUEST:
                return Object.assign({}, state, {
                    isAddingFood: true
                });

            case ActionTypes.FOODMANAGER_ADD_FOOD_RECEIVE_SUCCESS:
                const foods = [action.food, ...state.foods];
                return Object.assign({}, state, {
                    isAddingFood: false,
                    isAddFoodModalOpen: false,
                    result: undefined,
                    foods
                });

            case ActionTypes.FOODMANAGER_ADD_FOOD_RECEIVE_ERROR:
                return Object.assign({}, state, {
                    isAddingFood: false,
                    isAddFoodModalOpen: false,
                    result: {
                        code: ErrorCodes.ERROR,
                        message: JSON.stringify(action.error)
                    },
                });

            case ActionTypes.FOODMANAGER_CLEAR_ADD_FOOD_RESULT:
                return Object.assign({}, state, {
                    result: undefined,
                });

            default:
                return state;
        }
    }
};
