import React from 'react'
import { shallow, mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { Constants } from '../Constants'
import { AppHeader } from './AppHeader'
import LoadingIcon from './LoadingIcon'

describe('AppHeader', () => {
    let props;

    beforeEach(() => {
        props = {
            loadCurrentUser: jest.fn(),
            logOut: jest.fn(),
            isLoading: false,
        };
    })

    it('renders and loads current user', () => {
        const appHeader = shallow(<AppHeader {...props} />);
        expect(props.loadCurrentUser.mock.calls.length).toEqual(1);
    });

    it('shows loading indicator', () => {
        props.isLoading = true;
        const appHeader = shallow(<AppHeader {...props} />);
        const loadingIcon = appHeader.find(LoadingIcon);
        expect(loadingIcon.length).toEqual(1);
    });

    it('renders content', () => {
        const appHeader = shallow(<AppHeader {...props} />);
        expect(appHeader.text()).toContain(Constants.AppName);
        expect(appHeader.text()).toContain('Sign Up');
        expect(appHeader.text()).toContain('Log In');
    });

    it('mounts renders app name', () => {
        const appHeader = mount(<MemoryRouter><AppHeader {...props} /></MemoryRouter>);
        expect(appHeader.contains(Constants.AppName)).toEqual(true);
    });

    it('mounts without crashing', () => {
        mount(<MemoryRouter><AppHeader {...props} /></MemoryRouter>);
    });
})