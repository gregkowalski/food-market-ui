import React from 'react'
import ReactDOM from 'react-dom';

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

        if (this.props.children !== prevProps.children) {
            this.updateContent();
        }
    }

    componentWillUnmount() {
        this.map = null;
    }

    updateContent() {
        ReactDOM.render(this.props.children, this.customControl);
    }

    renderCustomControl() {

        let { map, google, position } = this.props;
        if (!google || !map) {
            return null;
        }
        if (!position) {
            position = google.maps.ControlPosition.BOTTOM_CENTER;
        }

        const container = window.document.createElement('div');
        ReactDOM.render(this.props.children, container);
        map.controls[position].push(container);
        this.customControl = container;

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