import { Selector } from 'redux-testkit'
import { Selectors } from './index'

describe('store/currentUser/Selectors', () => {

    const state = {
        currentUser: {
            isLoading: true,
            user: { name: 'xxx' }
        }
    };

    it('currentUser should return user', () => {
        Selector(Selectors.currentUser).expect(state).toReturn({ name: 'xxx' });
    });

    it('isLoading should return correct value', () => {
        Selector(Selectors.isLoading).expect(state).toReturn(true);
    });
})