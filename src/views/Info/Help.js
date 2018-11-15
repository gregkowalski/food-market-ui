import React from 'react'
import { Image, Divider, Grid } from 'semantic-ui-react'
import InfoPage from './InfoPage'
import './Help.css'
import helpImg1 from './help-img.jpg'


const Help = () => {
    const header = (
        <div className='help-header'>
            <Image src={helpImg1} />
            {/* <div className='help-img-credit'>Photograph by Brooke Lark</div> */}
            <div className='help-title'>Foodcraft Help Center</div>
        </div>
    );
    return (
        <InfoPage header={header}>
            <Grid stackable columns={3} verticalAlign='top' textAlign='left'>
                <Grid.Column>
                    <div className='help-cards'>Popular Questions</div>
                    <div>Does Foodcraft vet cooks?</div>
                    <Divider hidden />
                    <div>Is there a delivery option?</div>
                    <Divider hidden />
                    <div>Can I request an order?</div>
                </Grid.Column>
                <Grid.Column>
                    <div className='help-cards'>What To Expect</div>
                    <div>How do food exchanges happen?</div>
                    <Divider hidden />
                    <div>What are small-batch foods?</div>
                    <Divider hidden />
                    <div>Proper storage and re-heating</div>
                </Grid.Column>
                <Grid.Column>
                    <div className='help-cards'>Cancellations and Refunds</div>
                    <div>When should I cancel to receive a full refund?</div>
                    <Divider hidden />
                    <div>What happens when a cook cancels my order?</div>
                </Grid.Column>
            </Grid>


        </InfoPage>
    )
}

export default Help;