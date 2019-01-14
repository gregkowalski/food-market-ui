import { Thunk } from 'redux-testkit'
import { Actions, ActionTypes } from './index'
import CognitoUtil from '../../services/Cognito/CognitoUtil'
import ApiClient from '../../services/ApiClient'
jest.mock('../../services/Cognito/CognitoUtil')
jest.mock('../../services/ApiClient')


describe('store/currentUser/Actions', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should log out current user', () => {
        const dispatches = Thunk(Actions.logOut).execute();
        expect(dispatches.length).toEqual(1);
    });

    it('should NOT dispatch actions without congnito session', async () => {
        const dispatches = await Thunk(Actions.loadCurrentUser).execute();
        expect(dispatches.length).toEqual(0);
    });

    it('should get current user from API', async () => {
        CognitoUtil.isLoggedIn.mockImplementation(() => true);
        ApiClient.getUser.mockImplementation(() => Promise.resolve({ data: { email: 'xxx' } }));
        const state = {
            currentUser: {
                isLoading: false
            }
        }
        const dispatches = await Thunk(Actions.loadCurrentUser).withState(state).execute();
        expect(dispatches.length).toEqual(2);
        expect(dispatches[0].getAction()).toEqual({ type: ActionTypes.REQUEST_CURRENT_USER });
        expect(dispatches[1].getAction()).toEqual(expect.objectContaining({
            type: ActionTypes.RECEIVE_CURRENT_USER_SUCCESS,
            user: { email: 'xxx' }
        }));
    });

    it('should return error when get current user from API fails', async () => {
        CognitoUtil.isLoggedIn.mockImplementation(() => true);
        ApiClient.getUser.mockImplementation(() => Promise.reject('crapped out'));
        const state = {
            currentUser: {
                isLoading: false
            }
        }
        const dispatches = await Thunk(Actions.loadCurrentUser).withState(state).execute();
        expect(dispatches.length).toEqual(2);
        expect(dispatches[0].getAction()).toEqual({ type: ActionTypes.REQUEST_CURRENT_USER });
        expect(dispatches[1].getAction()).toEqual(expect.objectContaining({
            type: ActionTypes.RECEIVE_CURRENT_USER_ERROR,
            apiError: 'crapped out'
        }));
    });
})