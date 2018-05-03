import React from 'react'
import { Button } from 'semantic-ui-react'
import './FilterBar.css'

const FilterBar = ({ pickup, date, address, onFilterClick }) => {

    return (
        <div className='filterbar'>
            <div className='filterbar-layout'>
                <Button color='grey' onClick={onFilterClick}>
                    Filters
                </Button>
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
