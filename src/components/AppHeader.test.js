import React from 'react'
import { shallow, mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import AppHeader from './AppHeader'
import { Constants } from '../Constants'

describe('AppHeader', () => {
    it('renders without crashing', () => {
        shallow(<AppHeader.WrappedComponent />);
    });

    it('renders content', () => {
        const appHeader = shallow(<AppHeader.WrappedComponent />);
        expect(appHeader.text()).toContain(Constants.AppName);
        expect(appHeader.text()).toContain('Sign Up');
        expect(appHeader.text()).toContain('Log In');
    });

    it('mounts renders app name', () => {
        const appHeader = mount(<MemoryRouter><AppHeader /></MemoryRouter>);
        const appNameDiv = <div>{Constants.AppName}</div>
        expect(appHeader.contains(appNameDiv)).toEqual(true);
    });

    it('mounts without crashing', () => {
        mount(<MemoryRouter><AppHeader /></MemoryRouter>);
    });
})