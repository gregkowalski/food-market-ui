import ApiClient from '../../services/ApiClient'
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

function initFoods(foods) {
    foods.forEach(f => {
        f.id = f.food_id;
        f.images = f.imageUrls;
        f.image = f.imageUrls[0];
        f.header = f.title;
        f.meta = f.short_description;
        f.description = f.long_desciption;
        f.rating = 5;
        f.ratingCount = 3;
    });
    return foods;
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

            const prevFoods = getState().search.foods;

            dispatch(requestFoods());

            return ApiClient.geoSearchFoods(geo)
                .then(
                    response => {
                        let foods = initFoods(response.data);
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

    requestFoodsInRegion: (geo, region) => {

        return (dispatch) => {

            dispatch(requestFoods());

            return ApiClient.geoSearchFoods(geo)
                .then(
                    response => {
                        const foods = initFoods(response.data);

                        let regionFoods = [];
                        if (region) {
                            console.log('search region: ' + region.id);
                            const polygon = new window.google.maps.Polygon({ paths: region.paths });
                            regionFoods = foods.filter(food => {
                                const point = new window.google.maps.LatLng(food.position.lat, food.position.lng);
                                const contains = window.google.maps.geometry.poly.containsLocation(point, polygon);
                                console.log(`point=${point} contains: ${contains}`);
                                return contains;
                            });
                        }
                        dispatch(receiveFoodsSuccess(regionFoods));
                    },
                    error => {
                        dispatch(receiveFoodsError(error));
                    }
                );
        };
    },

    requestCurrentGeoLocation: (navigator) => {
        return (dispatch) => {

            if (!navigator || !navigator.geolocation) {
                return Promise.resolve();
            }

            const promise = new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            return promise.then(
                pos => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    const bound = Util.getGeoSearchBoundDegrees();
                    const geo = {
                        ne_lat: lat + bound,
                        ne_lng: lng + bound,
                        sw_lat: lat - bound,
                        sw_lng: lng - bound
                    };
                    dispatch(geoLocationChanged(geo));
                },
                error => console.error(error)
            );
        }
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
    foods: []
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
