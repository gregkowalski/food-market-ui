import * as ActionTypes from './actionTypes'
import ApiClient from '../../services/ApiClient'
import { ContactMethods } from '../../Enums';
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

function dateChanged(date) {
    return {
        type: ActionTypes.DATE_CHANGED,
        date
    };
}

function timeChanged(time) {
    return {
        type: ActionTypes.TIME_CHANGED,
        time
    };
}

function quantityChanged(quantity) {
    return {
        type: ActionTypes.QUANTITY_CHANGED,
        quantity
    };
}

function buyerEmailChanged(buyerEmail) {
    return {
        type: ActionTypes.BUYER_EMAIL_CHANGED,
        buyerEmail
    };
}

function buyerPhoneChanged(buyerPhone, isBuyerPhoneValid) {
    return {
        type: ActionTypes.BUYER_PHONE_CHANGED,
        buyerPhone,
        isBuyerPhoneValid
    };
}

function buyerAddressChanged(buyerAddress, isBuyerAddressValid) {
    return {
        type: ActionTypes.BUYER_ADDRESS_CHANGED,
        buyerAddress,
        isBuyerAddressValid
    };
}

function contactMethodChanged(contactMethod) {
    return {
        type: ActionTypes.CONTACT_METHOD_CHANGED,
        contactMethod
    };
}

function requestFood() {
    return {
        type: ActionTypes.REQUEST_FOOD
    };
}

function receiveFoodSuccess(food) {
    return {
        type: ActionTypes.RECEIVE_FOOD_SUCCESS,
        food,
        receivedAt: Date.now()
    };
}

function receiveFoodError(error) {
    return {
        type: ActionTypes.RECEIVE_FOOD_ERROR,
        error,
        receivedAt: Date.now()
    };
}

function requestCook() {
    return {
        type: ActionTypes.REQUEST_COOK
    };
}

function receiveCookSuccess(cook) {
    return {
        type: ActionTypes.RECEIVE_COOK_SUCCESS,
        cook,
        receivedAt: Date.now()
    };
}

function receiveCookError(error) {
    return {
        type: ActionTypes.RECEIVE_COOK_ERROR,
        error,
        receivedAt: Date.now()
    };
}

function requestReviews() {
    return {
        type: ActionTypes.REQUEST_REVIEWS
    };
}

function receiveReviewsSuccess(reviews) {
    return {
        type: ActionTypes.RECEIVE_REVIEWS_SUCCESS,
        reviews,
        receivedAt: Date.now()
    };
}

function receiveReviewsError(error) {
    return {
        type: ActionTypes.RECEIVE_REVIEWS_ERROR,
        error,
        receivedAt: Date.now()
    };
}

function initFood(food) {
    food.id = food.food_id;
    food.images = food.imageUrls;
    food.image = food.imageUrls[0];
    food.header = food.title;
    food.meta = food.short_description;
    food.description = food.long_desciption;
    food.rating = 5;
    food.ratingCount = 3;
    return food;
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

    dateChanged: (date) => {
        return (dispatch) => {
            dispatch(dateChanged(date));
        }
    },

    timeChanged: (time) => {
        return (dispatch) => {
            dispatch(timeChanged(time));
        }
    },

    quantityChanged: (quantity) => {
        return (dispatch) => {
            dispatch(quantityChanged(quantity));
        }
    },

    buyerEmailChanged: (buyerEmail) => {
        return (dispatch) => {
            dispatch(buyerEmailChanged(buyerEmail));
        }
    },

    buyerPhoneChanged: (buyerPhone) => {
        return (dispatch) => {

            const parsedPhone = Util.getAsYouTypePhone(buyerPhone);
            const isValid = Util.validatePhoneNumber(parsedPhone);
            dispatch(buyerPhoneChanged(parsedPhone, isValid));
        }
    },

    buyerAddressChanged: (buyerAddress) => {
        return (dispatch) => {
            const isValid = buyerAddress ? true : false;
            dispatch(buyerAddressChanged(buyerAddress, isValid));
        }
    },

    contactMethodChanged: (contactMethod) => {
        return (dispatch) => {
            dispatch(contactMethodChanged(contactMethod));
        }
    },

    clearOrder: () => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.CLEAR_ORDER });
        }
    },

    loadFood: (food_id) => {
        return (dispatch) => {

            dispatch(requestFood());

            return ApiClient.getFood(food_id)
                .then(
                    response => {
                        const food = initFood(response.data);
                        dispatch(receiveFoodSuccess(food));
                    },
                    error => {
                        dispatch(receiveFoodError(error));
                    }
                );
        };
    },

    loadCook: (cook_user_id) => {
        return (dispatch) => {

            dispatch(requestCook());

            return ApiClient.getPublicUser(cook_user_id)
                .then(
                    response => {
                        const user = response.data;
                        dispatch(receiveCookSuccess(user));
                    },
                    error => {
                        dispatch(receiveCookError(error));
                    }
                );
        };
    },

    loadReviews: (food_id) => {
        return (dispatch) => {

            dispatch(requestReviews());

            return ApiClient.getReviews(food_id)
                .then(
                    response => {
                        const reviews = response.data;
                        // const reviews = response.data.filter(r => r.food_id === food_id);
                        dispatch(receiveReviewsSuccess(reviews));
                    },
                    error => {
                        dispatch(receiveReviewsError(error));
                    }
                );
        };
    },

    submitOrder: (stripe, nameOnCard, order) => {
        return (dispatch) => {

            dispatch({ type: ActionTypes.SUBMIT_ORDER });

            console.log(order);
            stripe.createSource(
                {
                    amount: order.amount,
                    currency: 'cad',
                    usage: 'single_use',
                    metadata: { user_id: order.buyer_user_id },
                    owner: { name: nameOnCard }
                })
                .then(result => {
                    if (result.error) {
                        const ex = new Error('Payment failed!');
                        ex.error = result.error;
                        throw ex;
                    }
                    order.source = {
                        id: result.source.id,
                        amount: result.source.amount
                    };
                    return ApiClient.createFoodOrder(null, order);
                })
                .then(
                    response => {
                        dispatch({
                            type: ActionTypes.SUBMIT_ORDER_SUCCESS,
                            order_id: response.data.order_id
                        });
                    },
                    ex => {
                        console.error(ex);
                        let paymentError = 'Payment failed.'
                        if (ex.error && ex.error.message) {
                            paymentError = ex.error.message;
                        }
                        else if (ex.response && ex.response.data && ex.response.data.error) {
                            paymentError = ex.response.data.error;
                        }
                        dispatch({
                            type: ActionTypes.SUBMIT_ORDER_ERROR,
                            paymentError
                        });
                    });
        }
    }
}

export const Selectors = {
    food: (state) => { return state.order.food; },
    cook: (state) => { return state.order.cook; },
    reviews: (state) => { return state.order.reviews; },
    isFoodLoading: (state) => { return state.order.isFoodLoading; },
    isCookLoading: (state) => { return state.order.isCookLoading; },
    isReviewsLoading: (state) => { return state.order.isReviewsLoading; },
    pickup: (state) => { return state.order.pickup; },
    date: (state) => { return state.order.date; },
    time: (state) => { return state.order.time; },
    quantity: (state) => { return state.order.quantity; },
    buyerEmail: (state) => { return state.order.buyerEmail; },
    buyerPhone: (state) => { return state.order.buyerPhone; },
    isBuyerPhoneValid: (state) => { return state.order.isBuyerPhoneValid; },
    buyerAddress: (state) => { return state.order.buyerAddress; },
    isBuyerAddressValid: (state) => { return state.order.isBuyerAddressValid; },
    contactMethod: (state) => { return state.order.contactMethod; },
    isOrderProcessing: (state) => { return state.order.isOrderProcessing; },
    isOrderCompleted: (state) => { return state.order.isOrderCompleted; },
    paymentError: state => { return state.order.paymentError; },
    order_id: state => { return state.order.order_id; }
}

const initialState = {
    isFoodLoading: false,
    isCookLoading: false,
    isReviewsLoading: false,
    food: null,
    cook: null,
    reviews: [],
    pickup: true,
    quantity: 1,
    contactMethod: ContactMethods.email,
    buyerPhone: '',
    buyerAddress: '',
    isBuyerPhoneValid: true,
    isBuyerAddressValid: true,
    isOrderProcessing: false,
};

export const Reducers = {

    order: (state = initialState, action = {}) => {
        switch (action.type) {

            case ActionTypes.SELECT_PICKUP:
                return Object.assign({}, state, {
                    pickup: true
                });

            case ActionTypes.SELECT_DELIVERY:
                return Object.assign({}, state, {
                    pickup: false
                });

            case ActionTypes.REQUEST_FOOD:
                return Object.assign({}, state, {
                    isFoodLoading: true
                });

            case ActionTypes.RECEIVE_FOOD_ERROR:
                return Object.assign({}, state, {
                    isFoodLoading: false,
                    error: action.error
                });

            case ActionTypes.RECEIVE_FOOD_SUCCESS:
                return Object.assign({}, state, {
                    isFoodLoading: false,
                    food: action.food
                });

            case ActionTypes.REQUEST_COOK:
                return Object.assign({}, state, {
                    isCookLoading: true
                });

            case ActionTypes.RECEIVE_COOK_ERROR:
                return Object.assign({}, state, {
                    isCookLoading: false,
                    error: action.error
                });

            case ActionTypes.RECEIVE_COOK_SUCCESS:
                return Object.assign({}, state, {
                    isCookLoading: false,
                    cook: action.cook
                });

            case ActionTypes.REQUEST_REVIEWS:
                return Object.assign({}, state, {
                    isReviewsLoading: true
                });

            case ActionTypes.RECEIVE_REVIEWS_ERROR:
                return Object.assign({}, state, {
                    isReviewsLoading: false,
                    error: action.error
                });

            case ActionTypes.RECEIVE_REVIEWS_SUCCESS:
                return Object.assign({}, state, {
                    isReviewsLoading: false,
                    reviews: action.reviews
                });

            case ActionTypes.DATE_CHANGED:
                return Object.assign({}, state, {
                    date: action.date
                });

            case ActionTypes.TIME_CHANGED:
                return Object.assign({}, state, {
                    time: action.time
                });

            case ActionTypes.QUANTITY_CHANGED:
                return Object.assign({}, state, {
                    quantity: action.quantity
                });

            case ActionTypes.BUYER_EMAIL_CHANGED:
                return Object.assign({}, state, {
                    buyerEmail: action.buyerEmail
                });

            case ActionTypes.BUYER_PHONE_CHANGED:
                return Object.assign({}, state, {
                    buyerPhone: action.buyerPhone,
                    isBuyerPhoneValid: action.isBuyerPhoneValid
                });

            case ActionTypes.BUYER_ADDRESS_CHANGED:
                return Object.assign({}, state, {
                    buyerAddress: action.buyerAddress,
                    isBuyerAddressValid: action.isBuyerAddressValid
                });

            case ActionTypes.CONTACT_METHOD_CHANGED:
                const newState = Object.assign({}, state, {
                    contactMethod: action.contactMethod
                });
                if (action.contactMethod === ContactMethods.email) {
                    newState.isBuyerPhoneValid = true;
                }
                return newState;

            case ActionTypes.SUBMIT_ORDER:
                return Object.assign({}, state, {
                    isOrderProcessing: true
                });

            case ActionTypes.SUBMIT_ORDER_SUCCESS:
                return Object.assign({}, state, {
                    isOrderProcessing: false,
                    isOrderCompleted: true,
                    order_id: action.order_id
                });

            case ActionTypes.SUBMIT_ORDER_ERROR:
                return Object.assign({}, state, {
                    isOrderProcessing: false,
                    paymentError: action.paymentError
                });

            case ActionTypes.CLEAR_ORDER:
                return Object.assign({}, initialState);

            default:
                return state;
        }
    }
};
