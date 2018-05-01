import { createStore, applyMiddleware, combineReducers } from 'redux'
import { createLogger } from 'redux-logger'
import { reducer as formReducer } from 'redux-form'
import thunkMiddleware from 'redux-thunk'
import { persistStore, persistReducer, createTransform } from 'redux-persist'
import sessionStorage from 'redux-persist/lib/storage/session'
import { createBlacklistFilter, createWhitelistFilter } from 'redux-persist-transform-filter'
import moment from 'moment'
import { Reducers as currentUser } from './currentUser'
import { Reducers as publicUser } from './publicUser'
import { Reducers as search } from './search'
import { Reducers as order } from './order'
import { Reducers as buyerOrders } from './buyerOrders'
import { Reducers as cookOrders } from './cookOrders'

const configureStore = (options = {}) => {

    const middlewares = [thunkMiddleware];
    if (options.includeLogger) {
        const loggerMiddleware = createLogger();
        middlewares.push(loggerMiddleware);
    }

    // const searchFilter = createFilter('search', ['pickup', 'date']);
    const orderFilter = createWhitelistFilter('order', ['pickup', 'quantity', 'contactMethod', 'email', 'buyerPhone', 'buyerAddress']);
    const searchFilter = createWhitelistFilter('search', ['pickup', 'region', 'mapCenter', 'address']);
    const currentUserFilter = createBlacklistFilter('currentUser', ['apiErrorCode', 'apiError']);
    const publicUserFilter = createBlacklistFilter('publicUser');
    const myTransform = createTransform(
        // transform state on its way to being serialized and persisted.
        (inboundState, key) => {
            const inState = { ...inboundState };
            if (inState.region) {
                inState.region = { id: inState.region.id };
            }
            return inState;
        },
        // transform state being rehydrated
        (outboundState, key) => {
            const outState = { ...outboundState };
            if (outState.date) {
                outState.date = moment(outState.date, moment.ISO_8601);
            }
            if (outState.time) {
                if (outState.time.handoff_start_date) {
                    outState.time.handoff_start_date = moment(outState.time.handoff_start_date, moment.ISO_8601);
                }
                if (outState.time.handoff_end_date) {
                    outState.time.handoff_end_date = moment(outState.time.handoff_end_date, moment.ISO_8601);
                }
            }
            return outState;
        },
        // define which reducers this transform gets called for.
        { whitelist: ['order', 'search'] }
    );

    const persistConfig = {
        key: 'food-market:root',
        storage: sessionStorage,
        // transforms: [searchFilter, orderFilter, myTransform],
        transforms: [myTransform, orderFilter, currentUserFilter, publicUserFilter, searchFilter],
        whitelist: [
            'order',
            'search',
            // 'buyerOrders'
        ],
    }

    const reducers = Object.assign({},
        currentUser,
        search,
        order,
        buyerOrders,
        cookOrders,
        publicUser,
        {
            form: formReducer
        });
    const rootReducer = combineReducers(reducers);
    const persistedReducer = persistReducer(persistConfig, rootReducer);
    const store = createStore(persistedReducer, applyMiddleware(...middlewares));
    let persistor = persistStore(store);

    return { store, persistor };
}

export default configureStore;