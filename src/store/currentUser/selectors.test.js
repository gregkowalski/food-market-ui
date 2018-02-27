import { Selector } from 'redux-testkit'
import { Selectors } from './index'

describe('store/currentUser/Selectors', () => {

    const state = {
        currentUser: {
            isLoading: true,
            user: { name: 'xxx' }
        }
    };

    it('getCurrentUser should return user', () => {
        Selector(Selectors.getCurrentUser).expect(state).toReturn({ name: 'xxx' });
    });

    it('getIsLoading should return correct value', () => {
        Selector(Selectors.getIsLoading).expect(state).toReturn(true);
    });
})