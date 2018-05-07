import React from 'react'
import ReactDOM from 'react-dom'
import './Drawer.css'

class Drawer extends React.Component {

    componentDidMount() {
        this.drawer = window.document.createElement('div');
        document.body.appendChild(this.drawer);
        this._renderLayer();
    }

    setInnerDivRef = (innerDiv) => {
        if (!innerDiv) {
            return;
        }

        this.innerDiv = innerDiv;
        const transitionEnd = this.transitionEndEventName();
        this.innerDiv.addEventListener(transitionEnd, this.props.onTransitionEnd, false);
    }

    transitionEndEventName() {
        const el = document.createElement('div');
        const transitions = {
            'transition': 'transitionend',
            'OTransition': 'otransitionend',  // oTransitionEnd in very old Opera
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        };

        for (const i in transitions) {
            if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
                return transitions[i];
            }
        }

        console.error('TransitionEnd event is not supported in this browser');
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
            inner.height = 'calc(100% + 100px)';
        }
        else {
            inner.transform = 'translate3d(0, 0, 0)';
            inner.transition = 'all .5s ease';
            inner.height = '100%';
        }

        const content = (
            <div className='drawer-outer' style={{ zIndex: 1000 }}>
                <div className='drawer-inner' style={inner} ref={this.setInnerDivRef}>
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