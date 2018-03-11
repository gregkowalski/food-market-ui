import React from 'react'
import ReactDOM from 'react-dom'
import './Drawer.css'

class Drawer extends React.Component {

    componentDidMount() {
        this.drawer = window.document.createElement('div');
        document.body.appendChild(this.drawer);
        this._renderLayer();
    }

    componentDidUpdate() {
        this._renderLayer();
    }

    componentWillUnmount() {
        ReactDOM.unmountComponentAtNode(this.drawer);
        window.document.body.removeChild(this.drawer);
    }

    _renderLayer() {

        const { children, visible } = this.props;

        const inner = {
            zIndex: 1001,
        }
        if (!visible) {
            inner.transform = 'translate3d(0, 100%, 0)';
            inner.transition = 'all .5s ease';
        }
        else {
            inner.transform = 'translate3d(0, 0, 0)';
            inner.transition = 'all .5s ease';
        }

        const content = (
            <div className='drawer-outer' style={{ zIndex: 1000 }}>
                <div className='drawer-inner' style={inner}>
                    <div className='drawer-main'>
                        {children}
                    </div>
                </div>
            </div>
        );
        ReactDOM.render(content, this.drawer);
    }

    render() {
        return <noscript />;
    }
}

export default Drawer;