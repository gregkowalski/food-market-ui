import * as SearchActionTypes from '../search/actionTypes'
import ApiClient from '../../services/ApiClient'
import { ContactMethods } from '../../Enums';
import ApiObjectMapper from '../../services/ApiObjectMapper';
import { toast } from 'react-toastify'

const ActionTypes = {
    SELECT_PICKUP: 'SELECT_PICKUP',
    SELECT_DELIVERY: 'SELECT_DELIVERY',
    DATE_CHANGED: 'DATE_CHANGED',
    TIME_CHANGED: 'TIME_CHANGED',
    QUANTITY_CHANGED: 'QUANTITY_CHANGED',
    BUYER_EMAIL_CHANGED: 'BUYER_EMAIL_CHANGED',
    BUYER_PHONE_CHANGED: 'BUYER_PHONE_CHANGED',
    BUYER_ADDRESS_CHANGED: 'BUYER_ADDRESS_CHANGED',
    CONTACT_METHOD_CHANGED: 'CONTACT_METHOD_CHANGED',
    REQUEST_FOOD: 'REQUEST_FOOD',
    RECEIVE_FOOD_SUCCESS: 'RECEIVE_FOOD_SUCCESS',
    RECEIVE_FOOD_ERROR: 'RECEIVE_FOOD_ERROR',
    REQUEST_COOK: 'REQUEST_COOK',
    RECEIVE_COOK_SUCCESS: 'RECEIVE_COOK_SUCCESS',
    RECEIVE_COOK_ERROR: 'RECEIVE_COOK_ERROR',
    REQUEST_REVIEWS: 'REQUEST_REVIEWS',
    RECEIVE_REVIEWS_SUCCESS: 'RECEIVE_REVIEWS_SUCCESS',
    RECEIVE_REVIEWS_ERROR: 'RECEIVE_REVIEWS_ERROR',
    SUBMIT_ORDER: 'SUBMIT_ORDER',
    SUBMIT_ORDER_SUCCESS: 'SUBMIT_ORDER_SUCCESS',
    SUBMIT_ORDER_ERROR: 'SUBMIT_ORDER_ERROR',
    CLEAR_ORDER: 'CLEAR_ORDER',

    ORDER_PAYOPTION_CHANGED: 'ORDER_PAYOPTION_CHANGED',
    ORDER_PAYGUEST_ADD: 'ORDER_PAYGUEST_ADD',
    ORDER_PAYGUEST_REMOVE: 'ORDER_PAYGUEST_REMOVE',
    ORDER_PAYGUEST_CHANGE_EMAIL: 'ORDER_PAYGUEST_CHANGE_EMAIL',
    ORDER_PAYGUEST_PORTION_INCREASE: 'ORDER_PAYGUEST_PORTION_INCREASE',
    ORDER_PAYGUEST_PORTION_DECREASE: 'ORDER_PAYGUEST_PORTION_DECREASE',
}


export const PayOptions = {
    full: 'full',
    split: 'split'
}

export const Actions = {

    selectPickup: () => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.SELECT_PICKUP });
        }
    },

    selectDelivery: () => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.SELECT_DELIVERY });
        }
    },

    dateChanged: (date) => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.DATE_CHANGED, date });
        }
    },

    timeChanged: (time) => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.TIME_CHANGED, time });
        }
    },

    quantityChanged: (quantity) => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.QUANTITY_CHANGED, quantity });
        }
    },

    buyerEmailChanged: (buyerEmail) => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.BUYER_EMAIL_CHANGED, buyerEmail });
        }
    },

    buyerPhoneChanged: (buyerPhone) => {
        return (dispatch) => {

            dispatch({ type: ActionTypes.BUYER_PHONE_CHANGED, buyerPhone });
        }
    },

    buyerAddressChanged: (buyerAddress) => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.BUYER_ADDRESS_CHANGED, buyerAddress });
        }
    },

    contactMethodChanged: (contactMethod) => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.CONTACT_METHOD_CHANGED, contactMethod });
        }
    },

    clearOrder: () => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.CLEAR_ORDER });
        }
    },

    selectPayOption: (payOption) => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.ORDER_PAYOPTION_CHANGED, payOption });
        }
    },

    addPayGuest: () => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.ORDER_PAYGUEST_ADD });
        }
    },

    removePayGuest: (index) => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.ORDER_PAYGUEST_REMOVE, index });
        }
    },

    changePayGuestEmail: (index, email) => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.ORDER_PAYGUEST_CHANGE_EMAIL, index, email });
        }
    },

    decreasePayGuestPortion: (index) => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.ORDER_PAYGUEST_PORTION_DECREASE, index });
        }
    },

    increasePayGuestPortion: (index) => {
        return (dispatch) => {
            dispatch({ type: ActionTypes.ORDER_PAYGUEST_PORTION_INCREASE, index });
        }
    },



    loadFood: (food_id) => {
        return (dispatch) => {

            dispatch({ type: ActionTypes.REQUEST_FOOD });

            return ApiClient.getFood(food_id)
                .then(
                    response => {
                        const food = ApiObjectMapper.mapFood(response.data);
                        dispatch({ type: ActionTypes.RECEIVE_FOOD_SUCCESS, food });
                    },
                    error => {
                        dispatch({ type: ActionTypes.RECEIVE_FOOD_ERROR, error });
                    }
                );
        };
    },

    loadCook: (cook_user_id) => {
        return (dispatch) => {

            dispatch({ type: ActionTypes.REQUEST_COOK });

            return ApiClient.getPublicUser(cook_user_id)
                .then(
                    response => {
                        const user = response.data;
                        dispatch({ type: ActionTypes.RECEIVE_COOK_SUCCESS, cook: user });
                    },
                    error => {
                        dispatch({ type: ActionTypes.RECEIVE_COOK_ERROR, error });
                    }
                );
        };
    },

    loadReviews: (food_id) => {
        return (dispatch) => {

            dispatch({ type: ActionTypes.REQUEST_REVIEWS });

            return ApiClient.getReviews(food_id)
                .then(
                    response => {
                        const reviews = response.data.filter(r => r.food_id === food_id);
                        dispatch({ type: ActionTypes.RECEIVE_REVIEWS_SUCCESS, reviews });
                    },
                    error => {
                        dispatch({ type: ActionTypes.RECEIVE_REVIEWS_ERROR, error });
                    }
                );
        };
    },

    submitOrder: (stripe, nameOnCard, order) => {
        return (dispatch) => {

            dispatch({ type: ActionTypes.SUBMIT_ORDER });

            stripe.createSource(
                {
                    type: 'card',
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
                        let paymentError = 'Payment failed.'
                        if (ex.error && ex.error.message) {
                            paymentError = ex.error.message;
                        }
                        else if (ex.response && ex.response.data && ex.response.data.error) {
                            if (ex.response.data.error.message) {
                                paymentError = `Payment failed. ${ex.response.data.error.message}`;
                            }
                            else {
                                paymentError = ex.response.data.error;
                            }
                        }
                        toast.error(paymentError, { autoClose: false });
                        dispatch({ type: ActionTypes.SUBMIT_ORDER_ERROR });
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
    buyerAddress: (state) => { return state.order.buyerAddress; },
    contactMethod: (state) => { return state.order.contactMethod; },
    isOrderProcessing: (state) => { return state.order.isOrderProcessing; },
    isOrderCompleted: (state) => { return state.order.isOrderCompleted; },
    order_id: state => { return state.order.order_id; },

    payOption: state => { return state.order.payOption; },
    payGuests: state => { return state.order.payGuests; },
}

const emptyPayGuest = {
    email: '',
    portion: 1
};

const initialState = {
    isFoodLoading: false,
    isCookLoading: false,
    isReviewsLoading: false,
    food: undefined,
    cook: undefined,
    reviews: [],
    pickup: true,
    quantity: 1,
    contactMethod: ContactMethods.email,
    buyerPhone: undefined,
    buyerAddress: undefined,
    isOrderProcessing: false,

    payOption: PayOptions.full,
    payGuests: [Object.assign({}, emptyPayGuest)]
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
                });

            case ActionTypes.BUYER_ADDRESS_CHANGED:
                return Object.assign({}, state, {
                    buyerAddress: action.buyerAddress,
                });

            case SearchActionTypes.ADDRESS_CHANGED:
                return Object.assign({}, state, {
                    buyerAddress: action.address
                        ? action.address.formatted_address
                        : '',
                });

            case ActionTypes.CONTACT_METHOD_CHANGED:
                return Object.assign({}, state, {
                    contactMethod: action.contactMethod
                });

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
                });

            case ActionTypes.CLEAR_ORDER:
                return Object.assign({}, initialState);

            case ActionTypes.ORDER_PAYOPTION_CHANGED:
                return Object.assign({}, state, {
                    payOption: action.payOption
                });

            case ActionTypes.ORDER_PAYGUEST_ADD: {
                const newPayGuests = [...state.payGuests, Object.assign({}, emptyPayGuest)];
                return Object.assign({}, state, {
                    payGuests: newPayGuests
                });
            }

            case ActionTypes.ORDER_PAYGUEST_REMOVE: {
                const newPayGuests = [
                    ...state.payGuests.slice(0, action.index),
                    ...state.payGuests.slice(action.index + 1),
                ];
                return Object.assign({}, state, {
                    payGuests: newPayGuests
                });
            }

            case ActionTypes.ORDER_PAYGUEST_CHANGE_EMAIL: {
                const newPayGuest = Object.assign({}, state.payGuests[action.index], { email: action.email });
                const newPayGuests = [
                    ...state.payGuests.slice(0, action.index),
                    newPayGuest,
                    ...state.payGuests.slice(action.index + 1),
                ];
                return Object.assign({}, state, {
                    payGuests: newPayGuests
                });
            }

            case ActionTypes.ORDER_PAYGUEST_PORTION_INCREASE: {
                const payGuest = Object.assign({}, state.payGuests[action.index]);
                if (payGuest.portion < 9) {
                    payGuest.portion++;
                }

                const newPayGuests = [
                    ...state.payGuests.slice(0, action.index),
                    payGuest,
                    ...state.payGuests.slice(action.index + 1),
                ];
                return Object.assign({}, state, {
                    payGuests: newPayGuests
                });
            }

            case ActionTypes.ORDER_PAYGUEST_PORTION_DECREASE: {
                const payGuest = Object.assign({}, state.payGuests[action.index]);
                if (payGuest.portion > 1) {
                    payGuest.portion--;
                }

                const newPayGuests = [
                    ...state.payGuests.slice(0, action.index),
                    payGuest,
                    ...state.payGuests.slice(action.index + 1),
                ];
                return Object.assign({}, state, {
                    payGuests: newPayGuests
                });
            }

            default:
                return state;
        }
    }
};
