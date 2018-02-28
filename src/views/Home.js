import React from 'react'
import Util from '../services/Util'
import MobileSearch from './MobileSearch'
import DesktopSearch from './DesktopSearch'

export default class Home extends React.Component {
    render() {
        return Util.isMobile() ? <MobileSearch /> : <DesktopSearch />
    }
}