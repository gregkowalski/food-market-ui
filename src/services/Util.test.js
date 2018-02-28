import Util from './Util'

describe('add', () => {
    it('should add two numbers', () => {
        const location = {
            search: '?x=5&y=3'
        }
        let query = Util.parseQueryString(location);
        expect(query.x).toBe('5');
        expect(query.y).toBe('3');
    });
});