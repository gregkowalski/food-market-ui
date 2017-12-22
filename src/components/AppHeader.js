import React from 'react'
import { Image, Dropdown } from 'semantic-ui-react'
import { Constants } from '../Constants'
import './AppHeader.css'

export default class AppHeader extends React.Component {

    render() {
        let pos = 'relative';
        if (this.props.fixed) {
            pos = 'fixed';
        }
        return (
            <div className='head' style={{ position: pos }}>
                <div className='head-content'>
                    <div className='head-logo'>
                        <a href="/">
                            <Image style={{ marginTop: '5px' }} height='30px' src='/assets/images/newcart11.png' />
                        </a>
                        
                        <a href="/" className='head-link'>
                            <div style={{ marginTop: '10px', fontSize: '1.6em', fontWeight: 'bolder' }}>{Constants.AppName}</div>
                        </a>
                        <div className="content-desktop">
                            local. homemade. fresh.
                        </div>
                    </div>
                    <div className='head-filter'>
                    <Dropdown text='search' icon='search' floating labeled button closeOnChange className='icon'>
                        <Dropdown.Menu>
                            <Dropdown.Header icon='tags' content='Filter by tag' />
                            <Dropdown.Divider />
                            <Dropdown.Item icon='checkmark box' text='Ready-to-eat' />
                            <Dropdown.Item icon='fire' text='Uncooked' />
                            <Dropdown.Item icon='snowflake outline' text='Frozen' />
                            <Dropdown.Item icon='shopping basket' text='Ingredient' />
                        </Dropdown.Menu>
                    </Dropdown>
                    </div>
                </div>



            </div>
        );
    }
}