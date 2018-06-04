import moment from 'moment'
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

function mapCenterChanged(mapCenter) {
    return {
        type: ActionTypes.MAP_CENTER_CHANGED,
        mapCenter
    };
}

function addressChanged(address) {
    return {
        type: ActionTypes.ADDRESS_CHANGED,
        address
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

    requestFoods: (geo) => {
        return (dispatch, getState) => {

            const prevFoods = Selectors.foods(getState());
            dispatch(requestFoods());

            let beginDate;
            let endDate;

            const date = Selectors.date(getState());
            if (date) {
                beginDate = date.clone().hour(0);
                endDate = beginDate.clone().add(1, 'days');

                const now = moment();
                if (beginDate.format('YYYY-MM-DD') === now.format('YYYY-MM-DD')) {
                    beginDate.hour(now.hour());
                }

                beginDate = beginDate.toISOString();
                endDate = endDate.toISOString();
            }

            return ApiClient.geoSearchFoods(geo, beginDate, endDate)
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

        return (dispatch, getState) => {

            if (!region || !region.id) {
                dispatch(receiveFoodsSuccess([]));
                return Promise.resolve();
            }

            const prevFoods = Selectors.foods(getState());
            dispatch(requestFoods());

            return ApiClient.deliverySearchFoods(region.id)
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
            dispatch(dateChanged(date));
        }
    },

    mapCenterChanged: (mapCenter) => {
        return (dispatch) => {
            dispatch(mapCenterChanged(mapCenter));
        }
    },

    addressChanged: (address) => {
        return (dispatch) => {
            dispatch(addressChanged(address));
        }
    }
}

export const Selectors = {
    foods: (state) => {
        return state.search.foods;
    },
    isLoading: (state) => {
        return state.search.isLoading;
    },
    pickup: (state) => {
        return state.search.pickup;
    },
    geoLocation: (state) => {
        return state.search.geo;
    },
    region: (state) => {
        return state.search.region;
    },
    date: (state) => {
        return state.search.date;
    },
    mapCenter: (state) => {
        return state.search.mapCenter;
    },
    address: (state) => {
        return state.search.address;
    }
}

const initialState = {
    pickup: true,
    isLoading: false
};

export const Reducers = {

    search: (state = initialState, action = {}) => {
        switch (action.type) {

            case ActionTypes.MAP_CENTER_CHANGED:
                return Object.assign({}, state, {
                    mapCenter: action.mapCenter
                });

            case ActionTypes.ADDRESS_CHANGED:
                return Object.assign({}, state, {
                    address: action.address
                });

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
