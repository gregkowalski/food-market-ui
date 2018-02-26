import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { Reducers as AppHeaderReducers } from './components/AppHeader.redux'

const configureStore = () => {
    const loggerMiddleware = createLogger();
    const store = createStore(AppHeaderReducers,
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleware));

    return store;
}

export default configureStore;