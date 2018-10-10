import React from 'react'
import { Header, Modal, TextArea, Button } from 'semantic-ui-react'
import './ConfirmModal.css'

export default class ConfirmModal extends React.Component {

    componentWillReceiveProps(nextProps) {
        if (this.props.isProcessing && !nextProps.isProcessing) {
            this.props.onClose();
        }
    }

    render() {

        const { header, message, open, isProcessing, onConfirm, onClose, confirmButtonLabel } = this.props;

        let reason;
        const handleReasonChange = (event, data) => {
            reason = data.value;
        };

        const handleConfirm = () => {
            onConfirm(reason);
        };

        return (
            <Modal className='confirm-modal' open={open} dimmer='inverted' onClose={onClose}>
                <Modal.Header>{header}</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Header>{message}</Header>
                        <p>Write your message here</p>
                    </Modal.Description>
                    <TextArea autoHeight onChange={handleReasonChange} />
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={onClose}>Back</Button>
                    <Button loading={isProcessing} onClick={handleConfirm}>{confirmButtonLabel}</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}