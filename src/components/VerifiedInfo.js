import React from 'react';
import { Icon } from 'semantic-ui-react'

export default class VerifiedInfo extends React.Component {

    render() {
        let iconName = this.props.isVerified ? 'check circle outline' : 'remove circle outline';
        let iconColor = this.props.isVerified ? 'teal' : 'red';
        let icon = <Icon style={{ float: 'right' }} size='large' color={iconColor} name={iconName} />
        let style = this.props.style;
        if (!style) {
            style = {}
        }
        return (
            <div style={style}>
                <div style={{ float: 'left' }}>{this.props.label}</div>
                {icon}
                <div style={{ clear: 'both' }}></div>
            </div>);
    }
}