import React from 'react'
import { Modal, Checkbox } from 'semantic-ui-react'
import './FoodFilter.css'
import './DeliveryOptionModal.css'
import { DeliveryOptions } from '../../../Enums'

export default class DeliveryOptionModal extends React.Component {

    handleClick = (e, { value }) => {
        this.props.onApply(value === DeliveryOptions.pickup);
    }

    render() {
        const { isOpen, onClose, style, pickup } = this.props;

        return (
            <Modal className='foodfilter-deliveryoptions foodfilter-modal'
                style={style} dimmer={false} open={isOpen} onClose={onClose}>
                <Modal.Content>
                    <Checkbox radio label='Pickup' name='options' checked={pickup} value={DeliveryOptions.pickup} onClick={this.handleClick} />
                    <Checkbox radio label='Delivery' name='options' checked={!pickup} value={DeliveryOptions.delivery} onClick={this.handleClick} />
                </Modal.Content>
            </Modal>
        );
    }
}