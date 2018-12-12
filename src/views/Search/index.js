import React from 'react'
import Util from '../../services/Util'
import DesktopSearch from './Desktop/DesktopSearch'
import MobileSearch from './Mobile/MobileSearch'

export default class SearchContainer extends React.Component {

    componentWillMount() {
        const query = Util.parseQueryString(this.props.location);
        this.isMobile = query.mobile || query.m || Util.isMobile();

        const zoom = parseInt(query.zoom || query.z);
        if (zoom && !isNaN(zoom)) {
            this.zoom = zoom;
        }
    }

    render() {
        return this.isMobile ? <MobileSearch zoom={this.zoom} /> : <DesktopSearch zoom={this.zoom} />;
    }
}
