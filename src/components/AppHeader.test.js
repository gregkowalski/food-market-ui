import React from 'react'
import { shallow, mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import AppHeader from './AppHeader'

describe('AppHeader', () => {
    it('renders without crashing', () => {
        shallow(<AppHeader />);
    });

    it('renders content', () => {
        const appHeader = shallow(<AppHeader />);
        expect(appHeader.contains('Foodcraft')).toEqual(true);
    });

    it('mounts without crashing', () => {
        mount(<MemoryRouter><AppHeader /></MemoryRouter>);
    });
})