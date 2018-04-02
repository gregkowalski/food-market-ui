import React from 'react'
import { Button, Modal } from 'semantic-ui-react'
import './FoodFilter.css'
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import Util from '../services/Util'

export default class FoodFilter extends React.Component {

    handleDateClose = () => {
        if (this.props.onDateFilterClose) {
            this.props.onDateFilterClose();
        }
    }

    handleDateClear = () => {
        if (this.props.onDateFilterClear) {
            this.props.onDateFilterClear();
        }
    }

    handleDateApply = (date) => {
        if (this.props.onDateFilterApply) {
            this.props.onDateFilterApply(date);
        }
    }

    getButtonProps(active) {
        const props = {};
        if (!active) {
            props.basic = true;
        }
        return props;
    }

    render() {
        const { pickup, mobile, date, showDateFilter } = this.props;
        const style = Object.assign({}, this.props.style);
        const dateLabel = date ? date.format("MMM D, YYYY") : "Date";

        const mobileButtonStyle = {};
        if (!style.height) {
            style.height = '50px';
            if (mobile) {
                mobileButtonStyle.height = '50px';
            }
        }
        else {
            if (mobile) {
                mobileButtonStyle.height = style.height;
            }
        }

        return (
            <div className='foodfilter' style={style}>

                <div className={mobile ? 'foodfilter-layout-mobile' : 'foodfilter-layout'}>

                    {!mobile &&
                        <div id='foodfilter-date'>
                            <Button color='grey' {...this.getButtonProps(date)} onClick={this.props.onDateFilterClick}>{dateLabel}</Button>
                        </div>
                    }
                    <div id={mobile ? 'foodfilter-pickup-mobile' : 'foodfilter-pickup'}>
                        <Button color='purple' style={mobileButtonStyle} {...this.getButtonProps(pickup)} onClick={this.props.onPickupClick}>PICKUP</Button>
                        <Button color='purple' style={mobileButtonStyle} {...this.getButtonProps(!pickup)} onClick={this.props.onDeliveryClick}>DELIVER</Button>
                    </div>

                    {!mobile &&
                        <div id='foodfilter-expand'>
                            Resize window to show map &gt;&gt;
                        </div>
                    }

                </div>

                {!mobile &&
                    <DateModal showDateFilter={showDateFilter} date={date}
                        onClose={this.handleDateClose}
                        onClear={this.handleDateClear}
                        onApply={this.handleDateApply}
                    />
                }

            </div>
        );
    }
}

class DateModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = { open: false };
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.open !== nextProps.showDateFilter) {
            this.setState({ open: nextProps.showDateFilter });
        }

        if (this.state.date !== nextProps.date) {
            this.setState({ date: nextProps.date });
        }
    }

    handleApply = () => {
        if (this.props.onApply) {
            this.props.onApply(this.state.date);
        }
    }

    handleDateChange = (date) => {
        this.setState({ date: date });
    };

    render() {
        const { open, date } = this.state;

        return (
            <div>
                <Modal id='foodfilter-datepicker' dimmer={false} open={open} onClose={this.props.onClose}>
                    <Modal.Content>
                        <SingleDatePicker
                            date={date}
                            isOutsideRange={Util.isDayOutsideRange}
                            onDateChange={this.handleDateChange}
                            focused={true}
                            onFocusChange={({ focused }) => this.setState({ focused })}
                            numberOfMonths={1}
                        />
                        <div id='foodfilter-datepicker-actions'>
                            <div><Button onClick={this.props.onClear}>Clear</Button></div>
                            <div><Button color='purple' onClick={this.handleApply}>Apply</Button></div>
                        </div>
                    </Modal.Content>
                </Modal>
            </div>
        )
    }
}
