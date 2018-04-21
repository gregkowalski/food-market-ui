import React from 'react'
import { Button } from 'semantic-ui-react'
import './FilterBar.css'

export default class FilterBar extends React.Component {

    buttonProps(active) {
        const props = {
            color: 'purple'
        };
        if (!active) {
            props.basic = true;
        }
        return props;
    }

    render() {
        const { filter, className, style, pickup, onFilterClick, onPickupClick, onDeliveryClick } = this.props;

        let classNames = 'filterbar';
        if (className) {
            classNames += ' ' + className;
        }

        return (
            <div className={classNames} style={style}>
                <div className='filterbar-layout'>
                    <SearchBarFilterButton label='Filters' filter={filter} onFilterClick={onFilterClick} />
                    <Button {...this.buttonProps(pickup)} onClick={onPickupClick}>PICKUP</Button>
                    <Button {...this.buttonProps(!pickup)} onClick={onDeliveryClick}>DELIVERY</Button>
                </div>
            </div>
        );
    }
}

const SearchBarFilterButton = ({ filter, label, onFilterClick }) => {

    const props = { color: 'grey', basic: true };
    let filterCount = 0;
    if (filter) {
        if (filter.date) {
            filterCount++;
            props.basic = false;
        }
    }

    let text = label;
    if (filterCount > 0) {
        const middot = '\u00B7';
        text += ` ${middot} ${filterCount}`;
    }

    return (
        <Button {...props} onClick={onFilterClick}>
            {text}
        </Button>
    );
}