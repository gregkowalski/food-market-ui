import React from 'react'
import { shallow, mount } from 'enzyme'
import { MemoryRouter, Redirect } from 'react-router-dom'
import Login from './Login'
import CognitoUtil from '../services/Cognito/CognitoUtil'
jest.mock('../services/Cognito/CognitoUtil');

describe('Login', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders without crashing', () => {
        shallow(<Login />);
    });

    it('renders empty from shallow', () => {
        const login = shallow(<Login />);
        expect(login.text()).toEqual('');
    });

    it('renders empty div from mount', () => {
        const login = mount(<MemoryRouter><Login /></MemoryRouter>);
        expect(login.contains(<div></div>)).toEqual(true);
    });

    it('redirects to home when logged in', () => {
        CognitoUtil.isLoggedIn.mockReturnValue(true);
        const redirect = shallow(<Login />).find('Redirect');
        expect(redirect.props().to).toEqual('/');
    });

    it('redirects to cognito login when not logged in', () => {
        CognitoUtil.isLoggedIn.mockReturnValue(false);
        const login = shallow(<Login />);
        expect(CognitoUtil.redirectToLogin).toHaveBeenCalled();
    });
})
