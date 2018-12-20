import React from 'react'
import { Message } from 'semantic-ui-react'
import ErrorCodes from '../services/ErrorCodes'

export default class Toast extends React.Component {

    style = {
        cursor: 'pointer'
    }

    render() {
        const { result, onDismiss, successHeader, successMessage, errorMessage, errorHeader, className } = this.props;
        if (!result)
            return null;

        if (result.code === ErrorCodes.ERROR) {
            return (<Message error
                className={className}
                style={this.style}
                header={errorHeader}
                content={errorMessage || result.message}
                onClick={onDismiss} />);
        }

        if (result.code === ErrorCodes.SUCCESS) {
            return (<Message success
                className={className}
                style={this.style}
                header={successHeader}
                content={successMessage || result.message}
                onClick={onDismiss} />);
        }

        return null;
    }
}