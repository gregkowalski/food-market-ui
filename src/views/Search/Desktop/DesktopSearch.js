import React from 'react'
import { Dimmer } from 'semantic-ui-react'
import './DesktopSearch.css'
import LoadingIcon from '../../../components/LoadingIcon'
import AppHeader from '../../../components/AppHeader'
import FoodGrid from '../FoodGrid'
import FoodFilter from './FoodFilter'
import DesktopMap from './DesktopMap'

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
        this.setState({ hoveredFoodId: undefined });
    }

    hideDimmer = () => {
        if (this.state.dimmed) {
            this.setState({ dimmed: false });
        }
    }

    showDimmer = (show) => {
        this.setState({ dimmed: show });
    }

    render() {
        const { pickup, isLoading, foods, date, mapCenter, onGeoLocationChanged } = this.props;
        const { dimmed, hoveredFoodId } = this.state;

        return (
            <div className='dtsearch-wrap' onClick={this.hideDimmer}>
                <AppHeader fixed noshadow />
                <FoodFilter style={{ top: '55px', position: 'fixed' }}
                    show={dimmed}
                    onShowFilter={this.showDimmer}
                    onHideFilter={this.hideDimmer}
                />
                <div className='dtsearch-bodywrap'>
                    <Dimmer.Dimmable dimmed={dimmed}>
                        <Dimmer active={dimmed} inverted onClickOutside={this.hideDimmer}
                            style={{ position: 'fixed', marginTop: '105px' }} />
                        <div className='dtsearch-center'>
                            {!isLoading &&
                                <FoodGrid foods={foods} pickup={pickup} date={date}
                                    onFoodItemEnter={this.handleFoodItemEnter}
                                    onFoodItemLeave={this.handleFoodItemLeave} />
                            }
                            {isLoading &&
                                <div className='dtsearch-loading-icon'>
                                    <LoadingIcon size='big' />
                                </div>
                            }
                        </div>
                        <div className='dtsearch-right'>
                            <DesktopMap
                                foods={foods}
                                pickup={pickup}
                                date={date}
                                center={mapCenter}
                                initialCenter={mapCenter}
                                selectedLocation={mapCenter}
                                selectedFoodId={hoveredFoodId}
                                onGeoLocationChanged={onGeoLocationChanged}
                            />
                        </div>
                    </Dimmer.Dimmable>
                </div>
            </div >
        )
    }
}
