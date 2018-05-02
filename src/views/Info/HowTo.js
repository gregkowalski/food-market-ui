import React from 'react'
import { Icon, Grid, Image } from 'semantic-ui-react'
import InfoPage from './InfoPage'
import './HowTo.css'
import howtoImg from './howto-img.jpg'
import howtoImg2 from './howto-img2.jpg'


const HowTo = () => {
    const header = (
        <div className='howto-header'>
        <Image src={howtoImg2} />    
        {/* <div>Photograph by Brooke Lark</div>              */}
        </div>       
    );
    return (
        <InfoPage header={header}>
            <div className='howto-title'>From Kitchen to Table</div>
            <div className='howto-content'>
                <Grid stackable columns={3} verticalAlign='top' textAlign='center'>
                    <Grid.Column>
                        <Icon size='big' name='search' />
                        <div className='howto-cards'>Discover Unique Foods</div>
                        <div> Find neighbourhood cooks with family recipes or specialty foods curated for your diet.</div>
                    </Grid.Column>
                    <Grid.Column>
                        <Icon size='big' name='checked calendar' />
                        <div className='howto-cards'>Send an Order Request</div>
                        <div>Connect with your cook to confirm the date and time for your order. Pay conveniently through our secure platform.  </div>                        
                    </Grid.Column>
                    <Grid.Column>
                        <Icon size='big' name='food' />
                        <div className='howto-cards'>Eat Like Family</div>
                        <div>Enjoy and taste the difference of food made especially for you.</div>                                                
                    </Grid.Column>
                </Grid>
            </div>
        </InfoPage>
    )
}

export default HowTo;