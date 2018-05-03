import React from 'react'
import { Button } from 'semantic-ui-react'
import './FilterBar.css'

const FilterBar = ({ filter, onFilterClick }) => {

    const props = {
        color: 'grey',
        basic: filter ? false : true
    };

    return (
        <div className='filterbar'>
            <div className='filterbar-layout'>
                <Button {...props} onClick={onFilterClick}>
                    Filters
                </Button>
                {filter &&
                    <div>{filter.pickup ? 'Pickup ' : 'Deliver to '}
                        {filter.address &&
                            <span>{filter.address}</span>
                        }
                        {filter.date &&
                            <span>{' on ' + filter.date.format('MMM d')}</span>
                        }
                    </div>
                }
            </div>
        </div>
    );
}

export default FilterBar;
