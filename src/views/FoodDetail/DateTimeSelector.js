import React from 'react'
import moment from 'moment'
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

    handleDateChange = (date) => {
        if (!Util.isSameDay(this.props.date, date)) {
            this.props.onTimeChange(undefined);
            this.props.onDateChange(date);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        const { date, time, food } = nextProps;
        this.initFoodTimes(date, time, food);
    }

    componentWillMount() {
        const { date, time, food } = this.props;
        this.initFoodTimes(date, time, food);
    }

    initFoodTimes(date, time, food) {

        this.timeValue = undefined;
        this.orderTimes = undefined;

        if (!food || !food.handoff_dates || food.handoff_dates.length <= 0) {
            return;
        }

        this.foodTimes = [];
        let index = 0;
        const now = moment.utc();

        for (const handoff_date of food.handoff_dates) {
            const start = moment.utc(handoff_date.start);
            const end = moment.utc(handoff_date.end);
            if (now.diff(end) < 0 && Util.isSameLocalDay(start, date)) {
                this.foodTimes.push({
                    value: index++,
                    handoff_start_date: start,
                    handoff_end_date: end
                });
            }
        }

        if (time) {
            const foodTime = this.foodTimes.find(x => x.handoff_start_date.isSame(time.handoff_start_date)
                && x.handoff_end_date.isSame(time.handoff_end_date));
            if (foodTime) {
                this.timeValue = foodTime.value;
            }
        }

        this.orderTimes = this.foodTimes.map((foodTime, index) => {
            return { key: index, value: foodTime.value, text: Util.orderTimeToLocalTimeString(foodTime) }
        });
    }

    isDayOutsideRange = (date) => {
        const { food } = this.props;
        const { handoff_dates } = food;

        if (!handoff_dates || handoff_dates.length <= 0) {
            return Util.isDayOutsideRange(date);
        }

        const now = moment.utc();
        if (now.diff(date) > 0 && !Util.isSameLocalDay(now, date)) {
            return true;
        }

        for (const handoff_date of handoff_dates) {
            const start = moment.utc(handoff_date.start);
            const end = moment.utc(handoff_date.end);

            if (now.diff(end) < 0 && Util.isSameLocalDay(start, date)) {
                return false;
            }
        }

        return true;
    }

    render() {
        const { date } = this.props;

        return (
            <div className='datetimeselector-datetime'>
                <div className='datetimeselector-date'>
                    <div className='datetime-topspacing datetime-bottomspacing'>Date</div>
                    <SingleDatePicker
                        date={date}
                        isOutsideRange={this.isDayOutsideRange}
                        onDateChange={this.handleDateChange}
                        focused={this.state.focused}
                        onFocusChange={({ focused }) => this.setState({ focused })}
                        numberOfMonths={1}
                        placeholder="Which day?"
                        displayFormat={() => 'MMM D, YYYY'}
                    />
                </div>
                {this.orderTimes &&
                    <div className='datetimeselector-time'>
                        <div className='datetime-topspacing datetime-bottomspacing'>Time</div>
                        <Dropdown selection
                            placeholder='What time?'
                            options={this.orderTimes}
                            onChange={this.handleTimeChange}
                            value={this.timeValue}
                        />
                    </div>
                }
            </div>
        );
    }
}