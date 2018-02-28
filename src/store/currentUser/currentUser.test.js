import * as ActionTypes from './actionTypes'
import CognitoUtil from '../../services/Cognito/CognitoUtil'
import ApiClient from '../../services/ApiClient'
import configureStore from '../configureStore'
import { Selectors, Actions } from './index'

jest.mock('../../services/Cognito/CognitoUtil')
jest.mock('../../services/ApiClient')

describe('store/currentUser integration', () => {

    let store;

    beforeEach(() => {
        jest.resetAllMocks();
        store = configureStore();
    });

    it('should load current user', () => {
        CognitoUtil.isLoggedIn.mockImplementation(() => true);
        ApiClient.getCurrentUser.mockImplementation(() => Promise.resolve({ data: { email: 'xxx' } }));
        store.dispatch(Actions.loadCurrentUser())
            .then(() => {
                expect(Selectors.getCurrentUser(store.getState())).toEqual({ email: 'xxx' });
                expect(Selectors.getIsLoading(store.getState())).toEqual(false);
            })
    });

    it('should log out current user', () => {
        store.dispatch(Actions.logOut());
        expect(Selectors.getCurrentUser(store.getState())).toBeNull();
        expect(Selectors.getIsLoading(store.getState())).toEqual(false);
    });

});