import React from 'react'
import { Image } from 'semantic-ui-react'
import { Constants } from '../Constants'
import './LoadingHeader.css'
import LoadingIcon from './LoadingIcon'

const LoadingHeader = (props) => {
    let content;
    if (props && props.children) {
        content = props.children;
    }
    else {
        content = (
            <div className='loadingheader-loadingicon'>
                <LoadingIcon size='large' text='Logging in...' />
            </div>
        );
    }
    return (
        <div>
            <div className='loadingheader-logo'>
                <Image src={Constants.AppLogo} />
                <div>{Constants.AppName}</div>
            </div>
            {content}
        </div>
    );
}

export default LoadingHeader;