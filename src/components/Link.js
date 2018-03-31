import React from 'react'
import './Link.css'

const Link = ({ children, className, active, onClick }) => {

    let classNames = 'link'
    if (active) {
        classNames += ' link-active';
    }
    if (className) {
        classNames += ' ' + className;
    }
    return (
        <div className={classNames} onClick={onClick}>
            {children}
        </div>
    );
}

export default Link;