import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import Util from '../services/Util'
import './DateTimeSelector.css'

class DateTimeSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    handleTimeChange = (e, { value }) => {
        this.props.onTimeChange(value);
    }

    render() {
        const { date, time, onDateChange } = this.props;

        const OrderTimes = [
            { key: 0, text: '7 AM - 11 AM', value: 0 },
            { key: 1, text: '11 AM - 3 PM', value: 1 },
            { key: 2, text: '3 PM - 7 PM', value: 2 },
        ];

        return (
            <div className='datetimeselector-datetime'>
                <div className='datetimeselector-date'>
                    <div>Date</div>
                    <SingleDatePicker
                        date={date}
                        isOutsideRange={Util.isDayOutsideRange}
                        onDateChange={onDateChange}
                        focused={this.state.focused}
                        onFocusChange={({ focused }) => this.setState({ focused })}
                        numberOfMonths={1}
                        placeholder="Which day?"
                        displayFormat={() => 'MMM D, YYYY'}
                    />
                </div>
                <div className='datetimeselector-time'>
                    <div>Time</div>
                    <Dropdown selection
                        placeholder='What Time?'
                        options={OrderTimes}
                        onChange={this.handleTimeChange}
                        value={time}
                    />
                </div>
            </div>)

    }
}

export default DateTimeSelector