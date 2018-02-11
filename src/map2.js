import React from 'react'
// import './Map2.css'
import { compose, withProps, withStateHandlers, withHandlers } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMapLoader, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import { InfoBox } from "react-google-maps/lib/components/addons/InfoBox"
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer"
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import { MAP } from 'react-google-maps/lib/constants';
import { Button } from 'semantic-ui-react'

export default class Map2 extends React.PureComponent {
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

const MapWithAMakredInfoWindow = compose(
    withStateHandlers(() => ({
        isOpen: false,
    }), {
            onToggleOpen: ({ isOpen }) => () => ({
                isOpen: !isOpen,
            })
        }),
    withStateHandlers(() => ({
        pickup: true
    }), {
            handlePickupClick: ({ pickup }) => () => ({
                pickup: !pickup
            })
        }),
    withScriptjs,
    withGoogleMap
)(props => {

    const style1 = {
        backgroundColor: '#fff',
        border: '2px solid #fff',
        borderRadius: '3px',
        boxShadow: '0 2px 6px rgba(0,0,0,.3)',
        cursor: 'pointer',
        marginBottom: '22px',
        textAlign: 'center',
        title: 'Click to go back to list view',
    }

    // Set CSS for the control interior.
    const style2 = {
        color: 'rgb(25,25,25)',
        fontFamily: 'Roboto,Arial,sans-serif',
        fontSize: '16px',
        lineHeight: '38px',
        paddingLeft: '5px',
        paddingRight: '5px',
    }
    return (
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
            <MapControl controlPosition={window.google.maps.ControlPosition.BOTTOM_CENTER}>
                <div style={style1}>
                    <div style={style2} onClick={() => console.log('list view')}>
                        List View
                    </div>
                </div>
            </MapControl>
            <MapControl controlPosition={window.google.maps.ControlPosition.TOP_LEFT}>
                <div>
                    <Button style={{ marginTop: '22px' }} color={props.pickup ? 'teal' : 'grey'} onClick={props.handlePickupClick}>
                        Pickup
                    </Button>
                </div>
                <div>
                    <Button style={{ marginTop: '2px' }} color={!props.pickup ? 'teal' : 'grey'} onClick={props.handlePickupClick}>
                        Delivery
                    </Button>
                </div>
            </MapControl>
        </GoogleMap>
    )
});


class MapControl extends React.Component {
    static contextTypes = {
        [MAP]: PropTypes.object
    }

    static propTypes = {
        controlPosition: PropTypes.number
    }

    componentDidMount() {
        this.map = this.context[MAP];
        this._render();
    }

    componentDidUpdate() {
        this._render();
    }

    getControlPosition() {
        let { controlPosition } = this.props;
        if (!controlPosition) {
            controlPosition = window.google.maps.ControlPosition.TOP_LEFT;
        }
        return controlPosition;
    }

    componentWillUnmount() {
        let controlPosition = this.getControlPosition();
        const index = this.map.controls[controlPosition].getArray().indexOf(this.el);
        this.map.controls[controlPosition].removeAt(index);
    }
    _render() {
        let controlPosition = this.getControlPosition();
        const { children } = this.props;

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