import { createStore, applyMiddleware, combineReducers } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { Reducers as currentUser } from './currentUser'
import { Reducers as search } from './search'
import { Reducers as order } from './order'

const configureStore = (options = {}) => {

    const middlewares = [thunkMiddleware];
    if (options.includeLogger) {
        const loggerMiddleware = createLogger();
        middlewares.push(loggerMiddleware);
    }

    const reducers = Object.assign({}, currentUser, search, order);
    const store = createStore(combineReducers(reducers), applyMiddleware(...middlewares));

    return store;
}

export default configureStore;