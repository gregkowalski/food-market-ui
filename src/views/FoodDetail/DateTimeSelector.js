import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import Util from '../../services/Util'
import './DateTimeSelector.css'

export default class DateTimeSelector extends React.Component {

    state = {};

    handleTimeChange = (e, { value }) => {
        if (this.foodTimes) {
            const foodTime = this.foodTimes[value];
            this.props.onTimeChange({
                handoff_start_date: foodTime.handoff_start_date,
                handoff_end_date: foodTime.handoff_end_date,
            });
        }
    }

    render() {
        const { date, time, onDateChange } = this.props;

        let timeValue;
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

            if (time) {
                const foodTime = this.foodTimes.find(x => x.handoff_start_date.isSame(time.handoff_start_date)
                    && x.handoff_end_date.isSame(time.handoff_end_date));
                if (foodTime) {
                    timeValue = foodTime.value;
                }
            }

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
                        isOutsideRange={Util.isDayOutsideRange}
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
}