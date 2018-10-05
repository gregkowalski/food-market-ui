import React from 'react'
import { Button, Icon } from 'semantic-ui-react'
import './FilterBar.css'

const FilterBar = ({ pickup, date, address, onFilterClick, onMapClick }) => {

    const hasFilters = date || (!pickup && address && address.formatted_address);
    return (
        <div className='filterbar'>
            <div className='filterbar-layout'>
                <Button color='purple' basic={!hasFilters} onClick={onFilterClick}>
                    {date &&
                        <span>
                            {date.format('MMM D, YYYY')}
                            <span className='filterbar-bullet'>&bull;</span>
                        </span>
                    }
                    {pickup ? 'Pickup' : 'Delivery'}
                    {!pickup && address &&
                        <div>{address.formatted_address}</div>
                    }
                </Button>

                <div className='filterbar-map'>
                    <Button color='purple' basic onClick={onMapClick}>
                        <span>Map</span>
                        <Icon name='map marker alternate' color='purple' />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default FilterBar;
