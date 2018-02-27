import { Thunk } from 'redux-testkit'
import { Actions } from './index'
import * as ActionTypes from './actionTypes'
import CognitoUtil from '../../Cognito/CognitoUtil'
import ApiClient from '../../Api/ApiClient'
jest.mock('../../Cognito/CognitoUtil')
jest.mock('../../Api/ApiClient')

describe('store/currentUser/Actions', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should log out current user', () => {
        const dispatches = Thunk(Actions.logOut).execute();
        expect(dispatches.length).toEqual(1);
    });

    it('should NOT dispatch actions without congnito session', () => {
        Thunk(Actions.loadCurrentUser).execute()
            .then(dispatches => expect(dispatches.length).toEqual(0));
    });

    it('should get current user from API', () => {
        CognitoUtil.isLoggedIn.mockImplementation(() => true);
        ApiClient.getCurrentUser.mockImplementation(() => Promise.resolve({ data: { email: 'xxx' } }));
        //mockGetCurrentUser.mockImplementation(() => Promise.resolve({ data: { email: 'xxx' } }));
        Thunk(Actions.loadCurrentUser).execute()
            .then(dispatches => {
                expect(dispatches.length).toEqual(2);
                expect(dispatches[0].getAction()).toEqual({ type: ActionTypes.REQUEST_CURRENT_USER });
                expect(dispatches[1].getAction()).toEqual(expect.objectContaining({
                    type: ActionTypes.RECEIVE_CURRENT_USER_SUCCESS,
                    user: { email: 'xxx' }
                }));
            });
    });

    it('should return error when get current user from API fails', () => {
        CognitoUtil.isLoggedIn.mockImplementation(() => true);
        ApiClient.getCurrentUser.mockImplementation(() => Promise.reject('crapped out'));
        Thunk(Actions.loadCurrentUser).execute()
            .then(dispatches => {
                expect(dispatches.length).toEqual(2);
                expect(dispatches[0].getAction()).toEqual({ type: ActionTypes.REQUEST_CURRENT_USER });
                expect(dispatches[1].getAction()).toEqual(expect.objectContaining({
                    type: ActionTypes.RECEIVE_CURRENT_USER_ERROR,
                    error: 'crapped out'
                }));
            });
    });
})