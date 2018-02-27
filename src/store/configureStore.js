import { createStore, applyMiddleware, combineReducers } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { Reducers as currentUserReducers } from './currentUser'

const configureStore = (options = {}) => {

    const middlewares = [thunkMiddleware];
    if (options.includeLogger) {
        const loggerMiddleware = createLogger();
        middlewares.push(loggerMiddleware);
    }

    const reducers = combineReducers(currentUserReducers);
    const store = createStore(reducers, applyMiddleware(...middlewares));

    return store;
}

export default configureStore;