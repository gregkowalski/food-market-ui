import React from 'react'
import { Grid, Image } from 'semantic-ui-react'
import './WhyCook.css'
import whyCookImg from './whycook-img.jpg'
import whyCookImg1 from './whycook-img1.jpg'
import whyCookImg2 from './whycook-img2.jpg'
import whyCookImg3 from './whycook-img3.jpg'
import AppHeader from '../../components/AppHeader'
import AppFooter from '../../components/AppFooter';


const WhyCook = () => {
    return (
        <div>
            <AppHeader fixed />
            <div className='whycook-header'>
                <Image src={whyCookImg} />
                <div className='whycook-title'>
                    <div>Cook on Foodcraft</div>
                    Earn money as a Foodcraft cook</div>
                {/* <div>Photograph by Brooke Lark</div> */}
            </div>
            <div className='infopage'>
                <div className='whycook-top-content'>
                    <Grid stackable columns={3} verticalAlign='top' textAlign='left'>
                        <Grid.Column>
                            {/* <Icon size='big' name='search' /> */}
                            <div className='whycook-cards'>Why cook on Foodcraft?</div>
                            <div> All types of food and cooking skill levels are welcomed. Foodcraft is a community that supports local, small-batch cooking. </div>
                        </Grid.Column>
                        <Grid.Column>
                            {/* <Icon size='big' name='checked calendar' /> */}
                            <div className='whycook-cards'>You've got this.</div>
                            <div>Spend less time managing and more time doing what you love.  With Foodcraft, you're in control and can set up the process however you like.   </div>
                        </Grid.Column>
                        <Grid.Column>
                            {/* <Icon size='big' name='food' /> */}
                            <div className='whycook-cards'>And we've got you.</div>
                            <div>Foodcraft makes it simple and secure to earn money and grow your business.  We're here to help you, every bite of the way. </div>
                        </Grid.Column>
                    </Grid>
                </div>
            </div>
            <div className='whycook-content'>
                <div>
                    <div className='whycook-content-title'>How to be a Foodcraft cook</div>
                    <Grid stackable columns={2} verticalAlign='top' textAlign='left' reversed='mobile'>
                        <Grid.Column>
                            <div className='whycook-cards'>1. Connect your Stripe account</div>
                            <div> All types of food and cooking skill levels are welcomed. Foodcraft is a community that supports local, small-batch cooking. </div>
                        </Grid.Column>
                        <Grid.Column>
                            <div className='whycook-cooks-pic'>
                                <Image src={whyCookImg1} />
                            </div>
                        </Grid.Column>
                    </Grid>
                    <Grid stackable columns={2} verticalAlign='top' textAlign='left'>
                        <Grid.Column>
                            <div className='whycook-cooks-pic'>
                                <Image src={whyCookImg2} />
                            </div>
                        </Grid.Column>
                        <Grid.Column>
                            <div className='whycook-cards'>2. Add your food to the marketplace</div>
                            <div>Spend less time managing and more time doing what you love.  With Foodcraft, you're in control and can set up the process however you like.   </div>
                        </Grid.Column>
                    </Grid>
                    <Grid stackable columns={2} verticalAlign='top' textAlign='left' reversed='mobile'>
                        <Grid.Column>
                            <div className='whycook-cards'>3. Share your food</div>
                            <div>Foodcraft makes it simple and secure to earn money and grow your business.  We're here to help you, every bite of the way. </div>
                        </Grid.Column>
                        <Grid.Column>
                            <div className='whycook-cooks-pic'>
                                <Image src={whyCookImg3} />
                            </div>
                        </Grid.Column>
                    </Grid>
                </div>
            </div>

            {/* <div className='infopage'>
                <div className='whycook-top-content'>
                <div className='whycook-bottom-title'>Community</div>                
                    <Grid stackable columns={3} verticalAlign='top' textAlign='left'>
                        <Grid.Column>
                            <Icon size='big' name='search' />
                            <div className='whycook-cards'>Why cook on Foodcraft?</div>
                            <div> All types of food and cooking skill levels are welcomed. Foodcraft is a community that supports local, small-batch cooking. </div>
                        </Grid.Column>
                        <Grid.Column>
                            <Icon size='big' name='checked calendar' />
                            <div className='whycook-cards'>You've got this.</div>
                            <div>Spend less time managing and more time doing what you love.  With Foodcraft, you're in control and can set up the process however you like.   </div>
                        </Grid.Column>
                        <Grid.Column>
                            <Icon size='big' name='food' />
                            <div className='whycook-cards'>And we've got you.</div>
                            <div>Foodcraft makes it simple and secure to earn money and grow your business.  We're here to help you, every bite of the way. </div>
                        </Grid.Column>
                    </Grid>
                </div>
            </div> */}

            <AppFooter />
        </div>
    )
}

export default WhyCook;