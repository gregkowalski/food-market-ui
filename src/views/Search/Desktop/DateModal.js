import React from 'react'
import { Button, Modal } from 'semantic-ui-react'
import './FoodFilter.css'
import './DateModal.css'
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import Util from '../../../services/Util'

export default class DateModal extends React.Component {

    state = {};

    handleDateClear = () => {
        this.props.onApply(null);
    }

    handleDateChange = (date) => {
        this.props.onApply(date);
    };

    handleFocusChange = ({ focused }) => {
        this.setState({ focused });
    }

    render() {
        const { isOpen, date, onClose } = this.props;

        return (
            <Modal className='foodfilter-datepicker foodfilter-modal'
                dimmer='inverted' open={isOpen} onClose={onClose}>
                <Modal.Content>
                    <SingleDatePicker
                        date={date}
                        isOutsideRange={Util.isDayOutsideRange}
                        onDateChange={this.handleDateChange}
                        focused={true}
                        onFocusChange={this.handleFocusChange}
                        numberOfMonths={1}
                    />
                    <div className='foodfilter-datepicker-actions foodfilter-actions'>
                        <div><Button onClick={this.handleDateClear}>Clear</Button></div>
                    </div>
                </Modal.Content>
            </Modal>
        )
    }
}
