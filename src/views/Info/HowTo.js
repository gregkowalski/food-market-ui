import React from 'react'
import { Icon, Grid } from 'semantic-ui-react'
import InfoPage from './InfoPage'
import './HowTo.css'


const HowTo = () => {
    return (
        <InfoPage>
            <div className='howto-header'>How It Works</div>
            <div className='howto-content'>
                <Grid stackable columns={3} verticalAlign='middle' textAlign='center'>
                    <Grid.Column className='howto-cards'>
                        <Icon size='big' name='search' />
                        <div>Search for available food </div>
                    </Grid.Column>
                    <Grid.Column className='howto-cards'>
                        <Icon size='big' name='checked calendar' />
                        <div>Make an order request </div>
                    </Grid.Column>
                    <Grid.Column className='howto-cards'>
                        <Icon size='big' name='food' />
                        <div>Meet up with your cook </div>
                    </Grid.Column>
                </Grid>
            </div>
        </InfoPage>
    )
}

export default HowTo;