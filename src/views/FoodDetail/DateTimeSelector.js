import React from 'react'
import moment from 'moment'
import { Dropdown } from 'semantic-ui-react'
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import Util from '../../services/Util'
import './DateTimeSelector.css'
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { DaysOfWeek } from '../../Enums';

const availabilityKeys = [
    DaysOfWeek.monday, DaysOfWeek.tuesday, DaysOfWeek.wednesday, DaysOfWeek.thursday,
    DaysOfWeek.friday, DaysOfWeek.saturday, DaysOfWeek.sunday
];

export default class DateTimeSelector extends React.Component {

    state = {};
    localAvailability = undefined;

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

    initAvailability(food) {
        if(!food || !food.availability) {
            return;
        }

        if(this.localAvailability === undefined) {
            this.localAvailability = {};
            for (let day in food.availability) {
                let dayIndex = availabilityKeys.findIndex((d) => d === day) + 1;
                for (let hour of food.availability[day]) {
                    // using 2018-01-0x as the first day happens to be a Monday
                    let local = moment.utc('2018-01-0' + dayIndex + 'T' + hour + ':00', moment.ISO_8601).local();
                    let localDayOfWeek = availabilityKeys[local.isoWeekday() - 1];
                    if(!this.localAvailability[localDayOfWeek]) {
                        this.localAvailability[localDayOfWeek] = [];
                    }
                    this.localAvailability[localDayOfWeek].push(local.hour());
                }
            };
        }
    }

    initFoodTimes(date, time, food) {
        this.timeValue = undefined;
        this.orderTimes = undefined;

        if (!food || !date) {
            return;
        }

        this.initAvailability(food);
        if(!this.localAvailability) {
            return;
        }

        const hours = this.localAvailability[availabilityKeys[moment(date).isoWeekday() - 1]];
        if(!hours || hours.length <= 0) {
            return;
        }

        this.foodTimes = [];
        let index = 0;
        for (let hour of hours) {
            const start = moment(date).hour(hour);
            const end = start.clone().add(1, 'hour');
            this.foodTimes.push({
                value: index++,
                handoff_start_date: start,
                handoff_end_date: end
            });
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
        const now = moment.utc();
        if (now.diff(date) > 0 && !Util.isSameLocalDay(now, date)) {
            return true;
        }

        const hours = this.localAvailability[availabilityKeys[moment(date).isoWeekday() - 1]];
        if(hours !== undefined && hours.length > 0) {
            return false;
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