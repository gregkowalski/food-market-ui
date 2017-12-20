import React from 'react'
import { Image, Dropdown, Input } from 'semantic-ui-react'
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
                            <Image style={{ margin: '0 auto' }} height='20px' src='/assets/images/newcart11.png' />
                        </a>
                        <a href="/" className='head-link'>
                            <div style={{ marginTop: '2px', fontSize: '1.6em', fontWeight: 'bolder' }}>{Constants.AppName}</div>
                        </a>
                        <div className="content-desktop">
                            local. homemade. fresh.
                     </div>

                    </div>
                    <Dropdown text='search' icon='search' className='head-filter' inline labeled button inline noResultsMessage closeOnChange className='icon'>
                        <Dropdown.Menu>
                            <Dropdown.Header icon='tags' content='Filter by tag' />
                            <Dropdown.Divider />
                            <Dropdown.Item icon='checkmark box' text='Ready-to-eat' />
                            <Dropdown.Item icon='fire' text='Re-heat' />
                            <Dropdown.Item icon='snowflake outline' text='Frozen' />
                            <Dropdown.Item icon='shopping basket' text='Ingredient' />
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

            </div>
        );
    }
}