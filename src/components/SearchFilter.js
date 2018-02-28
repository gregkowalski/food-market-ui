import React from 'react'
import { Button } from 'semantic-ui-react'
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './SearchFilter.css'
import Util from '../services/Util'

export default class SearchFilter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    handleDateChange = (date) => {
        this.setState({ date: date }, () => this.triggerFilterChange());
    };

    handleFilterClear = () => {
        this.setState({ date: null }, () => this.triggerFilterChange());
    }

    triggerFilterChange() {
        if (this.props.onFilterChange) {
            this.props.onFilterChange({ date: this.state.date });
        }
    }

    getFooterStyle(visible) {
        const style = {};
        if (!visible) {
            style.display = 'none';
        }
        return style;
    }

    render() {
        const { visible } = this.props;

        return (
            <div className='searchfilter'>

                <div className='searchfilter-header'>
                    <div className='searchfilter-header-left'>
                        <div onClick={this.props.onFilterHide}>&times;</div>
                    </div>
                    <div className='searchfilter-header-center'>Filters</div>
                    <div className='searchfilter-header-right'>
                        <span onClick={this.handleFilterClear}>Clear</span>
                    </div>
                </div>

                <div className='searchfilter-date'>
                    <SingleDatePicker
                        date={this.state.date}
                        isOutsideRange={Util.isDayOutsideRange}
                        onDateChange={this.handleDateChange}
                        focused={this.state.focused}
                        onFocusChange={({ focused }) => this.setState({ focused })}
                        numberOfMonths={1}
                        placeholder="When do you want your food?"
                        displayFormat={() => 'MMM D, YYYY'}
                    />
                </div>

                <div className='searchfilter-footer' style={this.getFooterStyle(visible)}>
                    <Button className='searchfilter-footer-button' onClick={this.props.onFilterHide}>Show Dishes</Button>
                </div>

            </div>
        );
    }
}
