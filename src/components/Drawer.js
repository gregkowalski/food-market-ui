import React from 'react'
import './Drawer.css'

const Drawer = ({ children, visible }) => {

    const inner = {
        zIndex: 1001,
    }
    if (!visible) {
        inner.transform = 'translate3d(0, 100%, 0)';
        inner.transition = 'all .5s ease .1s';
    }
    else {
        inner.transform = 'translate3d(0, 0, 0)';
        inner.transition = 'all .5s ease .1s';
    }

    return (
        <div className='drawer-outer' style={{ zIndex: 1000 }}>
            <div className='drawer-inner' style={inner}>
                <div className='drawer-main'>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Drawer;