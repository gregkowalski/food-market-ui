import React from 'react'
import { Button, Modal } from 'semantic-ui-react'
import './FoodFilter.css'
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import Util from '../Util'

export default class FoodFilter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pickup: props.pickup,
            showDateFilter: false,
            date: null
        }
    }

    handleAddressChange = (place) => {
        console.log(place);
        this.setState({
            address: place,
            mapLocation: place.geometry.location,
            mapZoom: this.state.mapZoom
        });
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            pickup: nextProps.pickup,
            showDateFilter: nextProps.showDateFilter
        });
    }

    handleDateClose = () => {
        if (this.props.onDateFilterClose) {
            this.props.onDateFilterClose();
        }
    }

    handleDateClear = () => {
        this.setState({ date: null });
        if (this.props.onDateFilterClear) {
            this.props.onDateFilterClear();
        }
    }

    handleDateApply = (date) => {
        this.setState({ date: date });
        if (this.props.onDateFilterApply) {
            this.props.onDateFilterApply(date);
        }
    }

    static getButtonProps(active) {
        const props = {};
        if (active) {
            props.color = 'teal';
        }
        else
        {
            props.color = 'grey';
            props.basic = true;
        }
        return props;
    }

    render() {
        const style = Object.assign({}, this.props.style);
        const { pickup, showDateFilter, date } = this.state;

        const dateLabel = date ? date.format("MMM D, YYYY") : "Date";

        return (
            <div className='foodfilter' style={style}>
                <div className='foodfilter-layout'>
                    <div>
                        <Button {...FoodFilter.getButtonProps(date)} onClick={this.props.onDateFilterClick}>{dateLabel}</Button>
                    </div>
                    <div id='foodfilter-map'>
                        <Button {...FoodFilter.getButtonProps(pickup)} onClick={this.props.onPickupClick}>Pickup</Button>
                        <Button {...FoodFilter.getButtonProps(!pickup)} onClick={this.props.onDeliveryClick}>Delivery</Button>
                    </div>
                    <div id='foodfilter-expand'>
                        Resize to show map &gt;&gt;
                    </div>
                </div>

                <DateModal showDateFilter={showDateFilter}
                    onClose={this.handleDateClose}
                    onClear={this.handleDateClear}
                    onApply={this.handleDateApply}
                />
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
    }

    handleApply = () => {
        if (this.props.onApply) {
            this.props.onApply(this.state.date);
        }
    }

    handleDateChange = (date) => {
        console.dir(date);
        this.setState({ date: date });
    };

    render() {
        const { open } = this.state;

        return (
            <div>
                <Modal id='foodfilter-datepicker' dimmer={false} open={open} onClose={this.props.onClose}>
                    <Modal.Content>
                        <SingleDatePicker
                            date={this.state.date}
                            isOutsideRange={Util.isDayOutsideRange}
                            onDateChange={this.handleDateChange}
                            focused={true}
                            onFocusChange={({ focused }) => this.setState({ focused })}
                            numberOfMonths={1}
                        />
                        <div id='foodfilter-datepicker-actions'>
                            <div><Button onClick={this.props.onClear}>Clear</Button></div>
                            <div><Button color='teal' onClick={this.handleApply}>Apply</Button></div>
                        </div>
                    </Modal.Content>
                </Modal>
            </div>
        )
    }
}