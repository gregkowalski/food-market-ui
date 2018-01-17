import Enzyme from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-15';
import 'jest-enzyme'

// Setup enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() });

const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};

const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};
global.localStorage = localStorageMock;
global.sessionStorage = sessionStorageMock;