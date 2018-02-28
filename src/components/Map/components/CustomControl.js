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

    constructor(props) {
        super(props);

        let visible = true;
        if (typeof props.visible !== "undefined") {
            visible = props.visible;
        }
        this.state = { visible };
    }

    componentDidMount() {
        this.customControlPromise = wrappedPromise();
        this.renderCustomControl();
    }

    componentDidUpdate(prevProps) {
        if (this.props.map !== prevProps.map) {
            this.map = this.props.map;
            this.renderCustomControl();
        }

        if (this.props.visible !== prevProps.visible) {
            this.setState({ visible: this.props.visible }, () => this.renderCustomControl());
        }

        if (this.props.children !== prevProps.children) {
            this.updateContent();
        }
    }

    componentWillUnmount() {
        this.map = null;
    }

    updateContent() {
        if (this.customControl) {
            ReactDOM.render(this.props.children, this.customControl);
        }
    }

    renderCustomControl() {

        let { map, google, position } = this.props;
        if (!google || !map) {
            return null;
        }
        if (!position) {
            position = google.maps.ControlPosition.BOTTOM_CENTER;
        }

        if (!this.customControl) {
            this.customControl = window.document.createElement('div');
            ReactDOM.render(this.props.children, this.customControl);
            this.customControlPromise.resolve(this.customControl);
        }

        const index = map.controls[position].indexOf(this.customControl);
        if (this.state.visible && index < 0) {
            map.controls[position].push(this.customControl);
        }
        else if (index >= 0) {
            map.controls[position].removeAt(index);
        }
    }

    getCustomControl() {
        return this.customControlPromise;
    }

    render() {
        return null;
    }
}

export default CustomControl