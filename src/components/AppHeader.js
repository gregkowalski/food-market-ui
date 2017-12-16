import React from 'react'
import { Image } from 'semantic-ui-react'
import { Constants } from '../Constants'
import './AppHeader.css'

export default class AppHeader extends React.Component {

    render() {
        let pos = 'relative';
        if (this.props.fixed) {
            pos = 'fixed';
        }
        return (
            <div className='head' style={{position: pos}}>
                <div className='head-content'>
                    <div className='head-logo'>
                        <a href="/">
                            <Image style={{ margin: '0 auto' }} height='20px' src='/assets/images/appicon5.png' />
                        </a>
                        <a href="/" className='head-link'>
                            <div style={{ marginTop: '2px', fontSize: '1.6em', fontWeight: 'bolder' }}>{Constants.AppName}</div>
                        </a>
                        <div className="content-desktop">
                            local. homemade. fresh.
              </div>
                    </div>
                </div>
            </div>
        );
    }
}