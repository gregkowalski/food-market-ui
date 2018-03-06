import React from 'react'
import { Button, Icon, Modal, Header, Divider } from 'semantic-ui-react'
import './FlagListingMobile.css'
import Constants from '../Constants'

const FlagListing = () => {
    return (
        <div className='flag-listing-mobile'>
            <Modal
                dimmer='inverted'
                size='mini'
                trigger={<Button basic><Icon name='flag outline' />Report this listing</Button>}
                closeIcon>
                <Header icon='lock' content='Do you want to anonymously report this listing?' />
                <Modal.Content>
                    <p>Please choose one of the following reasons. This won't be shared with the cook.</p>
                </Modal.Content>

                <Modal.Actions>
                    <div className='flag-listing-item'>
                        <Button fluid > This shouldn’t be on {Constants.AppName}.</Button>
                        <div>
                            <Button fluid >I think I got sick from this food.</Button>
                        </div>
                        <div>
                            <Button fluid >This is not a real food product.</Button>
                        </div>
                        <div>
                            <Button fluid >It's offensive or a scam.</Button>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <Button fluid >It's something else.</Button>
                        </div>
                    </div>
                </Modal.Actions>
            </Modal>
            <Divider section />
        </div>
    )
}

export default FlagListing;