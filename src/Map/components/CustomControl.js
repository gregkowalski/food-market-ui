import React from 'react'
import PropTypes from 'prop-types'

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

export class CustomControl extends React.Component {

    componentDidMount() {
        this.customControlPromise = wrappedPromise();
        this.renderCustomControl();
    }

    componentDidUpdate(prevProps) {
        if (this.props.map !== prevProps.map) {
            this.map = this.props.map;
            this.renderCustomControl();
        }
    }

    componentWillUnmount() {
        this.map = null;
    }

    renderCustomControl() {

        let { map, google, position, mapCenter, icon, label, draggable, title, zIndex } = this.props;
        if (!google || !map) {
            return null;
        }

        var chicago = { lat: 41.85, lng: -87.65 };

        var control =
            (
                <div style={{
                    backgroundColor: '#fff', border: '2px solid #fff', borderRadius: '3px',
                    boxShadow: '0 2px 6px rgba(0,0,0,.3)',
                    cursor: 'pointer',
                    marginBottom: '22px',
                    textAlign: 'center',
                    title: 'Click to recenter the map'
                }}>
                    <div style={{
                        color: 'rgb(25,25,25)',
                        fontFamily: 'Roboto,Arial,sans-serif',
                        fontSize: '16px',
                        lineHeight: '38px',
                        paddingLeft: '5px',
                        paddingRight: '5px'
                    }}>
                        Center Map
                    </div>
                </div>
            )

        var centerControlDiv = window.document.createElement('div');

        var controlUI = window.document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to recenter the map';
        centerControlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = window.document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Center Map';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function () {
            map.setCenter(chicago);
        });

        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

        this.customControl = centerControlDiv;

        this.customControlPromise.resolve(this.customControl);
    }

    getCustomControl() {
        return this.customControlPromise;
    }

    render() {
        return null;
    }
}

export default CustomControl