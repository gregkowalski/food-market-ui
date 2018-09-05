import React from 'react'
import PropTypes from 'prop-types'
import ReactDOMServer from 'react-dom/server'

export class InfoWindow extends React.Component {

    componentDidMount() {
        this.renderInfoWindow();
    }

    componentDidUpdate(prevProps) {
        const { google, map } = this.props;

        if (!google || !map) {
            return;
        }

        if (map !== prevProps.map) {
            this.renderInfoWindow();
        }

        if (this.props.position !== prevProps.position) {
            this.updatePosition();
        }

        if (this.props.children !== prevProps.children) {
            this.updateContent();
        }

        if ((this.props.visible !== prevProps.visible ||
            this.props.marker !== prevProps.marker ||
            this.props.position !== prevProps.position)) {
            this.props.visible ?
                this.openWindow() :
                this.closeWindow();
        }
    }

    renderInfoWindow() {
        let { google } = this.props;
        //let {map, google, mapCenter} = this.props;

        if (!google || !google.maps) {
            return;
        }

        const iw = this.infowindow = new google.maps.InfoWindow({
            content: '',
            enableEventPropagation: true,
            disableAutoPan: false
        });

        google.maps.event.addListener(iw, 'closeclick', this.onClose.bind(this))
        google.maps.event.addListener(iw, 'domready', this.onOpen.bind(this));
    }

    onOpen() {
        if (this.props.onOpen) {
            this.props.onOpen();
        }
    }

    onClose() {
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    openWindow() {
        let anchor = null;
        if (this.props.marker) {
            anchor = this.props.marker;
        }
        else if (this.props.position) {
            anchor = { position: this.getLatLngPosition(this.props.position) };
        }
        else {
            anchor = { position: this.props.map.getCenter() }
        }

        this.infowindow.setPosition(anchor.position);
        this.infowindow.open(this.props.map);
    }

    getLatLngPosition(pos) {
        let { google } = this.props;
        if (!(pos instanceof google.maps.LatLng)) {
            return new google.maps.LatLng(pos.lat, pos.lng);
        }
        return pos;
    }

    updatePosition() {
        let pos = this.getLatLngPosition(this.props.position);
        this.infowindow.setPosition(pos);
    }

    updateContent() {
        const content = this.renderChildren();
        this.infowindow.setContent(content);
    }

    closeWindow() {
        this.infowindow.close();
    }

    renderChildren() {
        const { children } = this.props;
        return ReactDOMServer.renderToString(children);
    }

    render() {
        return null;
    }
}

InfoWindow.propTypes = {
    children: PropTypes.element.isRequired,
    map: PropTypes.object,
    marker: PropTypes.object,
    position: PropTypes.object,
    visible: PropTypes.bool,
    google: PropTypes.object.isRequired,

    // callbacks
    onClose: PropTypes.func,
    onOpen: PropTypes.func
}

InfoWindow.defaultProps = {
    visible: false
}

export default InfoWindow