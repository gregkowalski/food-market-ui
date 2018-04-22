import React from 'react';
import { Icon } from 'semantic-ui-react'

const VerifiedInfo = ({ isVerified, label }) => {

    if (!isVerified) {
        return null;
    }

    let iconName = isVerified ? 'check circle outline' : 'remove circle outline';
    let iconColor = isVerified ? 'teal' : 'red';
    let icon = <Icon style={{ float: 'right' }} size='large' color={iconColor} name={iconName} />
    return (
        <div>
            <div style={{ float: 'left' }}>{label}</div>
            {icon}
            <div style={{ clear: 'both' }}></div>
        </div>);
}

export default VerifiedInfo;