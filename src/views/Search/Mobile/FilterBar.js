import React from 'react'
import { Button, Icon } from 'semantic-ui-react'
import './FilterBar.css'

const FilterBar = ({ pickup, date, address, onFilterClick, onMapClick }) => {

    return (
        <div className='filterbar'>
            <div className='filterbar-layout'>
                <Button color='grey' basic onClick={onFilterClick}>
                    Filters
                </Button>

                <div className='filterbar-map'>
                    <Button color='grey' basic onClick={onMapClick}>
                        <span>Map</span>
                        <Icon name='marker' color='purple' />
                    </Button>
                </div>

                <div>{pickup ? 'Pickup ' : 'Deliver to '}
                    {!pickup && address &&
                        <span>{address.formatted_address}</span>
                    }
                    {date &&
                        <span>{' on ' + date.format('MMM d')}</span>
                    }
                </div>
            </div>
        </div>
    );
}

export default FilterBar;
