import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import Util from '../../services/Util'
import './DateTimeSelector.css'

class DateTimeSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    handleTimeChange = (e, { value }) => {
        if (this.foodTimes) {
            this.props.onTimeChange(this.foodTimes[value]);
        }
    }

    render() {
        const { date, time, onDateChange } = this.props;

        const timeValue = time ? time.value : null;

        let orderTimes;
        if (date) {
            const base = date.clone().hours(14).minutes(0).seconds(0).milliseconds(0);
            this.foodTimes = [
                {
                    value: 0,
                    handoff_start_date: base.clone(),
                    handoff_end_date: base.clone().add(2, 'hour')
                },
                {
                    value: 1,
                    handoff_start_date: base.clone().add(3, 'hour'),
                    handoff_end_date: base.clone().add(4, 'hour')
                },
                {
                    value: 2,
                    handoff_start_date: base.clone().add(6, 'hour'),
                    handoff_end_date: base.clone().add(8, 'hour')
                }
            ];

            orderTimes = this.foodTimes.map((foodTime, index) => {
                return { key: index, text: Util.orderTimeToString(foodTime), value: foodTime.value }
            });
        }

        return (
            <div className='datetimeselector-datetime'>
                <div className='datetimeselector-date'>
                    <div className='datetime-topspacing datetime-bottomspacing'>Date</div>
                    <SingleDatePicker
                        date={date}
                        isOutsideRange={this.isDayOutsideRange}
                        onDateChange={onDateChange}
                        focused={this.state.focused}
                        onFocusChange={({ focused }) => this.setState({ focused })}
                        numberOfMonths={1}
                        placeholder="Which day?"
                        displayFormat={() => 'MMM D, YYYY'}
                    />
                </div>
                {orderTimes &&
                    <div className='datetimeselector-time'>
                        <div className='datetime-topspacing datetime-bottomspacing'>Time</div>
                        <Dropdown selection
                            placeholder='What time?'
                            options={orderTimes}
                            onChange={this.handleTimeChange}
                            value={timeValue}
                        />
                    </div>
                }
            </div>
        );
    }
    
    isDayOutsideRange = (date) => {
        const day = date.format('YYYY-MM-DD');
        return (day !== '2018-05-12');
    }
}

export default DateTimeSelector