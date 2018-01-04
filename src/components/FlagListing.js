import React from 'react'
import './FlagListing.css'
import { Button, Popup, Icon, Modal, Header } from 'semantic-ui-react'
import { Constants } from '../Constants'

export default class FlagListing extends React.Component {
    state = {};

    render() {

        return (
            <div style={{ textAlign: 'center', color: '#5e5d5d' }}>
                <Modal dimmer='inverted' size='mini' trigger={<Button basic><Icon name='flag outline' /> Report this listing
                    </Button>} closeIcon>
                    <Header icon='lock' content='Do you want to anonymously report this listing?' />
                    <Modal.Content>
                        <p>Please choose one of the following reasons. This won't be shared with the cook. <a href='url'>Learn more</a></p>
                    </Modal.Content>

                    <Modal.Actions>
                        <div className='flag-listing-item'>
                            <Button>
                                This shouldn’t be on {Constants.AppName}.
                             </Button>
                            <Popup
                                trigger={<Icon size='large' name='question circle outline' />}
                                content='This contains false/misleading information or may be a fake listing.'
                                on={['click', 'hover']}
                                hideOnScroll />
                            <div>
                                <Button >
                                    I think I got sick from this food.
                             </Button>
                                <Popup
                                    trigger={<Icon size='large' name='question circle outline' />}
                                    content='This may have unlisted allergens or be unsafe to eat. *Call 9-1-1 if you feel your life may be in danger.'
                                    on={['click', 'hover']}
                                    hideOnScroll />
                            </div>
                            <div>
                                <Button >
                                    This is not a food product.
                            </Button>
                                <Popup
                                    trigger={<Icon size='large' name='question circle outline' />}
                                    content='This is promoting a service, and not an actual product.'
                                    on={['click', 'hover']}
                                    hideOnScroll />
                            </div>
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
                            <div>
                                <Button >
                                    Inappropriate or deceptive photo.
                            </Button>
                                <Popup
                                    trigger={<Icon size='large' name='question circle outline' />}
                                    content='Photos doesn’t match description or it contains violent, graphic, promotional or other offensive content.'
                                    on={['click', 'hover']}
                                    hideOnScroll />
                            </div>
                        </div>
                    </Modal.Actions>
                </Modal>
            </div >
        )
    }
}