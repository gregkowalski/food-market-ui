import React from 'react'
import { Dimmer } from 'semantic-ui-react'
import './DesktopSearch.css'
import DesktopMap from './DesktopMap'
import LoadingIcon from '../../components/LoadingIcon'
import AppHeader from '../../components/AppHeader'
import FoodGrid from './FoodGrid'
import FoodFilter from './FoodFilter'

export default class DesktopSearch extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hoveredFoodId: null,
            dimmed: false
        };
    }

    handleFoodItemEnter = (itemId) => {
        this.setState({ hoveredFoodId: itemId });
    }

    handleFoodItemLeave = (itemId) => {
        this.setState({ hoveredFoodId: null });
    }

    handleDateFilterClose = () => {
        this.hideDimmer();
    }

    handleDateFilterClear = () => {
        this.props.onDateChanged(null);
        this.hideDimmer();
    }

    handleDateFilterApply = (date) => {
        this.props.onDateChanged(date);
        this.hideDimmer();
    }

    handleDateFilterClick = () => {
        this.setState({ dimmed: !this.state.dimmed });
    }

    hideDimmer = () => {
        if (this.state.dimmed) {
            this.setState({ dimmed: false });
        }
    }

    render() {
        const { dimmed } = this.state;
        const { pickup, isLoading, foods, region, date } = this.props;

        return (
            <div className='dtsearch-wrap' onClick={this.hideDimmer}>
                <AppHeader fixed noshadow />
                <FoodFilter style={{ top: '55px', position: 'fixed' }}
                    showDateFilter={dimmed}
                    pickup={pickup}
                    date={date}
                    onPickupClick={this.props.onPickupClick}
                    onDeliveryClick={this.props.onDeliveryClick}
                    onDateFilterClick={this.handleDateFilterClick}
                    onDateFilterClose={this.handleDateFilterClose}
                    onDateFilterClear={this.handleDateFilterClear}
                    onDateFilterApply={this.handleDateFilterApply} />
                <div className='dtsearch-bodywrap'>
                    <Dimmer.Dimmable dimmed={dimmed}>
                        <Dimmer active={dimmed} inverted onClickOutside={this.hideDimmer}
                            style={{ position: 'fixed', marginTop: '105px' }} />
                        <div className='dtsearch-center'>
                            <div style={{ display: isLoading ? 'none' : 'inherit' }}>
                                <FoodGrid foods={foods} pickup={pickup} date={date}
                                    onFoodItemEnter={this.handleFoodItemEnter}
                                    onFoodItemLeave={this.handleFoodItemLeave} />
                            </div>
                            <div style={{ display: !isLoading ? 'none' : 'inherit' }}>
                                <div className='dtsearch-loading-icon'>
                                    <LoadingIcon size='big' />
                                </div>
                            </div>
                        </div>
                        <div className='dtsearch-right'>
                            <DesktopMap
                                foods={foods}
                                pickup={pickup}
                                date={date}
                                selectedRegion={region}
                                selectedFoodId={this.state.hoveredFoodId}
                                onGeoLocationChanged={this.props.onGeoLocationChanged}
                                onRegionSelected={this.props.onRegionSelected} />
                        </div>
                    </Dimmer.Dimmable>
                </div>
            </div >
        )
    }
}
