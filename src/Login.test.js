import React from 'react'
import { shallow, mount } from 'enzyme'
import { MemoryRouter, Redirect } from 'react-router-dom'
import Login from './Login'

jest.mock('./Cognito/CognitoUtil');

describe('Login', () => {

    let cognitoUtil;

    beforeEach(() => {
        cognitoUtil = require('./Cognito/CognitoUtil').default;
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
        cognitoUtil.isLoggedIn.mockReturnValue(true);
        const redirect = shallow(<Login />).find('Redirect');
        expect(redirect.props().to).toEqual('/');
    });

    it('redirects to cognito login when not logged in', () => {
        cognitoUtil.isLoggedIn.mockReturnValue(false);
        const login = shallow(<Login />);
        expect(cognitoUtil.redirectToLogin).toHaveBeenCalled();
    });
})
