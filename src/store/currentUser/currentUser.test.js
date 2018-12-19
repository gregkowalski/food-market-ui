import CognitoUtil from '../../services/Cognito/CognitoUtil'
import ApiClient from '../../services/ApiClient'
import configureStore from '../configureStore'
import { Selectors, Actions, ActionTypes } from './index'

jest.mock('../../services/Cognito/CognitoUtil')
jest.mock('../../services/ApiClient')

describe('store/currentUser integration', () => {

    let store;

    beforeEach(() => {
        jest.resetAllMocks();
        store = configureStore().store;
    });

    it('should load current user', async () => {
        CognitoUtil.isLoggedIn.mockImplementation(() => true);
        ApiClient.getCurrentUser.mockImplementation(() => Promise.resolve({ data: { email: 'xxx' } }));
        await store.dispatch(Actions.loadCurrentUser());
        expect(Selectors.currentUser(store.getState())).toEqual({ email: 'xxx' });
        expect(Selectors.isLoading(store.getState())).toEqual(false);
    });

    it('should log out current user', () => {
        store.dispatch(Actions.logOut());
        expect(Selectors.currentUser(store.getState())).toBeNull();
        expect(Selectors.isLoading(store.getState())).toEqual(false);
    });

});