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
                    <Grid.Column>
                        <Icon size='big' name='search' />
                        <div className='howto-cards'> Search for available food </div>
                        <div>Discover neighbourhood cooks and find food near you. Filter your searches by pickup or delivery availability.</div>
                    </Grid.Column>
                    <Grid.Column>
                        <Icon size='big' name='checked calendar' />
                        <div className='howto-cards'>Make an order request </div>
                        <div>Let your cook know the day and time that you want your food.</div>                        
                    </Grid.Column>
                    <Grid.Column>
                        <Icon size='big' name='food' />
                        <div className='howto-cards'>Meet up with your cook </div>
                        <div>Whether it's delivery or at a rendezvous point, all food is made to order and fresh.  This is the beauty of small-batch foods!</div>                                                
                    </Grid.Column>
                </Grid>
            </div>
        </InfoPage>
    )
}

export default HowTo;