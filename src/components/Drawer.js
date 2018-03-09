import React from 'react'

const Drawer = ({ children, visible, zIndex, scrolling }) => {

    if (!zIndex) {
        zIndex = 2000;
    }
    const style = {
        height: 0,
        width: '100%',
        top: '100%',
        bottom: 0,
        overflow: 'hidden',
        position: 'fixed',
        zIndex: zIndex,
        backgroundColor: 'white',
        transition: '0.3s',
    }

    if (visible) {
        style.height = '100%';
        style.top = 0;
    }

    if (scrolling) {
        style.position = 'absolute';
        style.height = 'auto';
    }

    return (
        <div style={style}>
            {children}
        </div>
    );
}

export default Drawer;