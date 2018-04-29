import ApiClient from '../../services/ApiClient'
import ApiObjectMapper from '../../services/ApiObjectMapper'
import * as ActionTypes from './actionTypes'
import Util from '../../services/Util'

function selectPickup() {
    return {
        type: ActionTypes.SELECT_PICKUP
    };
}

function selectDelivery() {
    return {
        type: ActionTypes.SELECT_DELIVERY,
    };
}




function requestFoods() {
    return {
        type: ActionTypes.REQUEST_FOODS,
    };
}
function receiveFoodsSuccess(foods) {
    return {
        type: ActionTypes.RECEIVE_FOODS_SUCCESS,
        foods,
        receivedAt: Date.now()
    };
}

function receiveFoodsError(error) {
    return {
        type: ActionTypes.RECEIVE_FOODS_ERROR,
        error,
        receivedAt: Date.now()
    };
}

function clearFoods() {
    return {
        type: ActionTypes.CLEAR_FOODS,
    };
}


function geoLocationChanged(geo) {
    return {
        type: ActionTypes.GEO_LOCATION_CHANGED,
        geo
    };
}

function regionChanged(region) {
    return {
        type: ActionTypes.REGION_CHANGED,
        region
    };
}

function dateChanged(date) {
    return {
        type: ActionTypes.DATE_CHANGED,
        date
    };
}

export const Actions = {

    selectPickup: () => {
        return (dispatch) => {
            dispatch(selectPickup());
        }
    },

    selectDelivery: () => {
        return (dispatch) => {
            dispatch(selectDelivery());
        }
    },

    clearFoods: () => {
        return (dispatch) => {
            dispatch(clearFoods());
        }
    },

    requestFoods: (geo) => {
        return (dispatch, getState) => {

            const prevFoods = getState().search.foods;

            dispatch(requestFoods());

            return ApiClient.geoSearchFoods(geo)
                .then(
                    response => {
                        let foods = ApiObjectMapper.mapFoods(response.data);
                        if (Util.areEqualFoods(prevFoods, foods)) {
                            foods = prevFoods;
                        }
                        dispatch(receiveFoodsSuccess(foods));
                    },
                    error => {
                        dispatch(receiveFoodsError(error));
                    }
                );
        };
    },

    requestFoodsInRegion: (region) => {

        return (dispatch) => {

            if (!region || !region.id) {
                return Promise.resolve();
            }

            dispatch(requestFoods());

            return ApiClient.deliverySearchFoods(region.id)
                .then(
                    response => {
                        const foods = ApiObjectMapper.mapFoods(response.data);
                        dispatch(receiveFoodsSuccess(foods));
                    },
                    error => {
                        dispatch(receiveFoodsError(error));
                    }
                );
        };
    },

    geoLocationChanged: (geo) => {
        return (dispatch) => {
            dispatch(geoLocationChanged(geo));
        }
    },

    regionChanged: (region) => {
        return (dispatch) => {
            dispatch(regionChanged(region));
        }
    },

    dateChanged: (date) => {
        return (dispatch) => {
            dispatch(dateChanged(date))
        }
    }
}

export const Selectors = {
    getFoods: (state) => {
        return state.search.foods;
    },
    getIsLoading: (state) => {
        return state.search.isLoading;
    },
    getPickup: (state) => {
        return state.search.pickup;
    },
    getGeoLocation: (state) => {
        return state.search.geo;
    },
    getRegion: (state) => {
        return state.search.region;
    },
    getDate: (state) => {
        return state.search.date;
    }
}

const initialState = {
    pickup: true,
    isLoading: false,
    date: null,
    foods: null
};

export const Reducers = {

    search: (state = initialState, action = {}) => {
        switch (action.type) {

            case ActionTypes.SELECT_PICKUP:
                return Object.assign({}, state, {
                    pickup: true
                });

            case ActionTypes.SELECT_DELIVERY:
                return Object.assign({}, state, {
                    pickup: false
                });

            case ActionTypes.REQUEST_FOODS:
                return Object.assign({}, state, {
                    isLoading: true
                });

            case ActionTypes.RECEIVE_FOODS_ERROR:
                return Object.assign({}, state, {
                    isLoading: false,
                    error: action.error
                });

            case ActionTypes.RECEIVE_FOODS_SUCCESS:
                return Object.assign({}, state, {
                    isLoading: false,
                    foods: action.foods
                });

            case ActionTypes.CLEAR_FOODS:
                return Object.assign({}, state, {
                    foods: initialState.foods
                });

            case ActionTypes.GEO_LOCATION_CHANGED:
                return Object.assign({}, state, {
                    geo: action.geo
                });

            case ActionTypes.REGION_CHANGED:
                return Object.assign({}, state, {
                    region: action.region
                });

            case ActionTypes.DATE_CHANGED:
                return Object.assign({}, state, {
                    date: action.date
                });

            default:
                return state;
        }
    }
};
