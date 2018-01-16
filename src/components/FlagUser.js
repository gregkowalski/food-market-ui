import React from 'react'
import './FlagUser.css'
import { Button, Popup, Icon, Modal, Header } from 'semantic-ui-react'
import { Constants } from 'Constants'

export default class FlagListing extends React.Component {
    state = {};

    render() {

        return (
            <Modal dimmer='inverted' size='mini' trigger={<Button basic><Icon name='flag outline' /> Report this user
            </Button>} closeIcon>
                <Header icon='lock' content='Do you want to anonymously report this user?' />
                <Modal.Content>
                    Please choose one of the following reasons. This won't be shared with the cook. <a href='url'>Learn more </a>
                </Modal.Content>
                <Modal.Actions>
                    <div className='flag-user-item'>
                        <Button>
                            This profile shouldn’t be on {Constants.AppName}.
                        </Button>
                        <Popup
                            trigger={<Icon size='large' name='question circle outline' />}
                            content='This contains false/misleading information or may be a fake listing.'
                            on={['click', 'hover']}
                            hideOnScroll />
                        <div>
                            <Button >
                                Inappropriate content or spam.
                        </Button>
                            <Popup
                                trigger={<Icon size='large' name='question circle outline' />}
                                content='The description of this listing contain violent, graphic, promotional, or other offensive content.'
                                on={['click', 'hover']}
                                hideOnScroll />
                        </div>
                    </div>
                </Modal.Actions>
            </Modal>
        )
    }
}