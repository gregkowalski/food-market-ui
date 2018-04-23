import React from 'react'
import { Divider } from 'semantic-ui-react'
import InfoPage from './InfoPage'
import './HowTo.css'


const HowTo = () => {
    return (
        <InfoPage>
            <div className='howto-header'>How It Works</div>
            <Divider hidden />
            <div className='howto-content'>
            <ol>
                <li> </li>
                <li> </li>
                <li> </li>
                </ol>
            </div>
        </InfoPage>
    )
}

export default HowTo;