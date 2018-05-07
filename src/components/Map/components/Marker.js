import React from 'react'
import PropTypes from 'prop-types'

import { camelize } from '../lib/String'

const evtNames = [
    'click',
    'dblclick',
    'dragend',
    'mousedown',
    'mouseout',
    'mouseover',
    'mouseup',
    'recenter',
];

const wrappedPromise = function () {
    var wrappedPromise = {},
        promise = new Promise(function (resolve, reject) {
            wrappedPromise.resolve = resolve;
            wrappedPromise.reject = reject;
        });
    wrappedPromise.then = promise.then.bind(promise);
    wrappedPromise.catch = promise.catch.bind(promise);
    wrappedPromise.promise = promise;

    return wrappedPromise;
}

export class Marker extends React.Component {

    componentDidMount() {
        this.markerPromise = wrappedPromise();
        this.renderMarker();
    }

    componentDidUpdate(prevProps) {
        if ((this.props.map !== prevProps.map) ||
            (this.props.position !== prevProps.position) ||
            (this.props.icon !== prevProps.icon)) {

            // delay the removal of the old marker to prevent flicker
            const oldMarker = this.marker;
            if (oldMarker) {
                setTimeout(() => oldMarker.setMap(null), 0);
            }

            this.renderMarker();
        }
    }

    componentWillUnmount() {
        if (this.marker) {
            this.marker.setMap(null);
        }
    }

    renderMarker() {
        let { map, google, position, mapCenter, icon, label, draggable, title, zIndex } = this.props;
        if (!google) {
            return null;
        }

        let pos = position || mapCenter;
        if (!(pos instanceof google.maps.LatLng)) {
            position = new google.maps.LatLng(pos.lat, pos.lng);
        }

        const pref = {
            map: map,
            position: position,
            icon: icon,
            label: label,
            title: title,
            draggable: draggable,
        };
        if (zIndex) {
            pref.zIndex = zIndex;
        }
        this.marker = new google.maps.Marker(pref);

        evtNames.forEach(e => {
            this.marker.addListener(e, this.handleEvent(e));
        });

        this.markerPromise.resolve(this.marker);
    }

    getMarker() {
        return this.markerPromise;
    }

    handleEvent(evt) {
        return (e) => {
            const evtName = `on${camelize(evt)}`
            if (this.props[evtName]) {
                this.props[evtName](this.props, this.marker, e);
            }
        }
    }

    render() {
        return null;
    }
}

Marker.propTypes = {
    position: PropTypes.object,
    map: PropTypes.object
}

evtNames.forEach(e => Marker.propTypes[e] = PropTypes.func)

Marker.defaultProps = {
    name: 'Marker'
}

export default Marker