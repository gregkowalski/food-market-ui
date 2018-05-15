import React from 'react'
import { Button, Icon } from 'semantic-ui-react'
import './FilterBar.css'

const FilterBar = ({ pickup, date, address, onFilterClick, onMapClick }) => {

    return (
        <div className='filterbar'>
            <div className='filterbar-layout'>
                <Button basic onClick={onFilterClick}>
                    {date &&
                        <span>
                            {date.format('MMM d')}
                            <span className='filterbar-bullet'>&bull;</span>
                        </span>
                    }
                    {pickup ? 'Pickup' : 'Delivery'}
                    {!pickup && address &&
                        <div>{address.formatted_address}</div>
                    }
                </Button>

                <div className='filterbar-map'>
                    <Button basic onClick={onMapClick}>
                        <span>Map</span>
                        <Icon name='marker' color='purple' />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default FilterBar;
