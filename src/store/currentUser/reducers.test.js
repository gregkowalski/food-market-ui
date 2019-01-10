import { Reducer } from 'redux-testkit'
import { Reducers, ActionTypes } from './index'
import ErrorCodes from '../../services/ErrorCodes'

describe('store/currentUser/Reducers', () => {

    const initialState = {
        isLoading: false,
        isSaving: false
    };

    it('should have initial state', () => {
        expect(Reducers.currentUser()).toEqual(initialState);
    });

    it('should not affect state', () => {
        Reducer(Reducers.currentUser).expect({ type: 'NOT_EXISTING' }).toReturnState(initialState);
    });

    it('should request current user', () => {
        const state = { isLoading: false, apiError: null };
        Reducer(Reducers.currentUser)
            .withState(state)
            .expect({ type: ActionTypes.REQUEST_CURRENT_USER })
            .toChangeInState({ isLoading: true });
    });

    it('should not modify state when requesting current user', () => {
        const state = { isLoading: false, apiError: null };
        Reducer(Reducers.currentUser)
            .withState(state)
            .expect({ type: ActionTypes.REQUEST_CURRENT_USER })
            .toChangeInState({ isLoading: true });
        expect(state.isLoading).toEqual(false);
    });

    it('should receive current user with success', () => {
        const user = {};
        Reducer(Reducers.currentUser)
            .expect({ type: ActionTypes.RECEIVE_CURRENT_USER_SUCCESS, user })
            .toReturnState({ isLoading: false, isSaving: false, user });
    });

    it('should not modify state when receiveing current user with success', () => {
        const state = { isLoading: true, user: null };
        const user = {};
        Reducer(Reducers.currentUser)
            .withState(state)
            .expect({ type: ActionTypes.RECEIVE_CURRENT_USER_SUCCESS, user })
            .toReturnState({ isLoading: false, user });
        expect(state.isLoading).toEqual(true);
    });

    it('should receive current user with error', () => {
        const apiError = {};
        Reducer(Reducers.currentUser)
            .expect({ type: ActionTypes.RECEIVE_CURRENT_USER_ERROR, apiError })
            .toChangeInState({ isLoading: false, apiError, apiErrorCode: ErrorCodes.USER_DOES_NOT_EXIST });
    });

    it('should not modify state when receiveing current user with error', () => {
        const state = { isLoading: true, user: null };
        const apiError = {};
        Reducer(Reducers.currentUser)
            .withState(state)
            .expect({ type: ActionTypes.RECEIVE_CURRENT_USER_ERROR, apiError })
            .toChangeInState({ isLoading: false, apiError, apiErrorCode: ErrorCodes.USER_DOES_NOT_EXIST });
        expect(state.isLoading).toEqual(true);
    });

    it('should logout current user', () => {
        Reducer(Reducers.currentUser)
            .expect({ type: ActionTypes.CURRENT_USER_LOGOUT })
            .toChangeInState({ isLoading: false, user: null });
    });

    it('should not modify state when logging out current user', () => {
        const state = { isLoading: false, user: {} };
        Reducer(Reducers.currentUser)
            .withState(state)
            .expect({ type: ActionTypes.CURRENT_USER_LOGOUT })
            .toChangeInState({ isLoading: false, user: null });
        expect(state.user).toEqual({});
    });
})