import React from 'react'
import { shallow, mount } from 'enzyme'
import { MemoryRouter, Redirect } from 'react-router-dom'
import Login from './Login'

describe('Login', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders without crashing', () => {
        shallow(<Login />);
    });

    it('renders empty from shallow', () => {
        const login = shallow(<Login />);
        expect(login.contains(<Redirect to='/' />)).toEqual(true);
    });

    it('renders empty div from mount', () => {
        const login = mount(<MemoryRouter><Login /></MemoryRouter>);
        expect(login.contains(<Redirect to='/' />)).toEqual(true);
    });
})
