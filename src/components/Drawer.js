import React from 'react'

const Drawer = ({ children, visible }) => {

    const style = {
        height: 0,
        width: '100%',
        top: '100%',
        bottom: 0,
        overflow: 'hidden',
        position: 'fixed',
        zIndex: 2000,
        backgroundColor: 'white',
        transition: '0.3s',
    }

    if (visible) {
        style.height = '100%';
        style.top = 0;
    }

    return (
        <div style={style}>
            {children}
        </div>
    );
}

export default Drawer;