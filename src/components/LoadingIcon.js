import React from 'react'
import { Icon } from 'semantic-ui-react'
import './LoadingIcon.css'

export default class LoadingIcon extends React.Component {

    getStyle() {
        const style = {};
        if (this.props.size === 'big') {
            style.fontSize = '24px';
        }
        return style;
    }

    render() {

        const { size, text } = this.props;

        return (
            <div style={this.getStyle()}>
                <Icon className='loading-icon' loading name='circle notched' size={size} />
                {text}
            </div>
        );
    }
}

LoadingIcon.defaultProps = {
    size: 'small',
    text: 'Loading...'
}
