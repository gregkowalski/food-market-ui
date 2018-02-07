import React from 'react'
// import './Map2.css'
import { compose, withProps, withStateHandlers, withHandlers } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMapLoader, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import { InfoBox } from "react-google-maps/lib/components/addons/InfoBox"
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer"
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import { MAP } from 'react-google-maps/lib/constants';

class Map2 extends React.PureComponent {
    render() {
        return (
            <MapWithAMakredInfoWindow
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        );
    }
}

export default Map2;

class MapControl extends React.Component {
    static contextTypes = {
        [MAP]: PropTypes.object
    }

    static propTypes = {
        controlPosition: PropTypes.number
    }

    // static defaultProps = {
    //     controlPosition: window.google.maps.ControlPosition.TOP_LEFT
    // }

    componentDidMount() {
        this.map = this.context[MAP];
        this._render();
    }

    componentDidUpdate() {
        this._render();
    }

    componentWillUnmount() {
        const { controlPosition } = this.props;
        const index = this.map.controls[controlPosition].getArray().indexOf(this.el);
        this.map.controls[controlPosition].removeAt(index);
    }
    _render() {
        const { controlPosition, children } = this.props;

        render(
            <div ref={el => {
                if (!this.renderedOnce) {
                    this.el = el;
                    this.map.controls[controlPosition].push(el);
                } else if (el && this.el && el !== this.el) {
                    this.el.innerHTML = '';
                    [].slice.call(el.childNodes).forEach(child => this.el.appendChild(child));
                }
                this.renderedOnce = true;
            }}>
                {children}
            </div>,
            document.createElement('div')
        );
    }

    render() {
        return <noscript />;
    }
}

const MapWithAMakredInfoWindow = compose(
    withStateHandlers(() => ({
        isOpen: false,
    }), {
            onToggleOpen: ({ isOpen }) => () => ({
                isOpen: !isOpen,
            })
        }),
    withScriptjs,
    withGoogleMap
)(props =>
    <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: -34.397, lng: 150.644 }}
    >
        <Marker
            position={{ lat: -34.397, lng: 150.644 }}
            onClick={props.onToggleOpen}
        >
            {props.isOpen && <InfoWindow onCloseClick={props.onToggleOpen}>
                <div style={{ backgroundColor: 'red', padding: '20px' }}>
                    Hello world
                </div>
            </InfoWindow>}
        </Marker>
        <MapControl controlPosition={window.google.maps.ControlPosition.TOP_CENTER}>
            This is great
        </MapControl>
    </GoogleMap>
    );
