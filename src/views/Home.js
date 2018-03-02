import React from 'react'
import Util from '../services/Util'
import MobileSearch from './MobileSearch'
import DesktopSearchContainer from './DesktopSearchContainer'

export default class Home extends React.Component {
    render() {
        return Util.isMobile() ? <MobileSearch /> : <DesktopSearchContainer />
    }
}