import React from 'react'
import { Icon } from 'semantic-ui-react'
import './LoadingIcon.css'

export default class LoadingIcon extends React.Component {

    render() {

        return (
            <div><Icon className='loading-icon' loading name='circle notched' />Loading...</div>
        );
    }
}
