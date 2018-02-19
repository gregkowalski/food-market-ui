import React from 'react'
import { Button } from 'semantic-ui-react'
import './FilterBar.css'

export default class FilterBar extends React.Component {

    getSearchFilterButtonComponent(filter) {
        const props = { color: 'teal', basic: true };
        let filterCount = 0;
        if (filter) {
            if (filter.date) {
                filterCount++;
                props.basic = false;
            }
        }

        let text = 'Filters';
        if (filterCount > 0) {
            const middot = '\u00B7';
            text += ` ${middot} ${filterCount}`;
        }

        return (
            <Button {...props} onClick={this.props.onFilterClick}>
                {text}
            </Button>
        );
    }

    render() {
        const { filter, style } = this.props;

        return (
            <div className='filterbar' style={style}>
                <div className='filterbar-layout'>
                    <div id='filterbar-date'>
                        {this.getSearchFilterButtonComponent(filter)}
                    </div>
                </div>
            </div>
        )
    }
}