import React from 'react'
import { Grid, Icon, Image } from 'semantic-ui-react'
import InfoPage from './InfoPage'
import './Cooks.css'

const Cooks = () => {
    return (
        <InfoPage>
            <div className='cooks-title'>Neighbourhood Cooks
            <div>We are a community dedicated to sharing handmade foods. </div>
            </div>

            <div className='cooks-content'>
                <Grid stackable columns={2} verticalAlign='middle' textAlign='left'>
                    <Grid.Column>
                        <div id='cooks-pic'><Image size='medium' circular src="/assets/images/users/shaynaB_full.jpg" /></div>
                        <div id='cooks-pic-mobile'><Image circular src="/assets/images/users/shaynaB_full.jpg" /></div>
                    </Grid.Column>
                    <Grid.Column>
                        <Icon size='big' color='purple' name='quote left' />
                        <div>I just love baking! Another passion of mine is clean eating.
                            When I do find a recipe I enjoy, my goal is to switch it up so it becomes a healthier choice.</div>
                        <div className='cooks-cards'>Shayna
                            <div>Yaletown</div>
                        </div>
                    </Grid.Column>
                </Grid>
                <Grid stackable columns={2} verticalAlign='middle' textAlign='right' reversed='mobile'>
                    <Grid.Column>
                        <Icon size='big' color='purple' name='quote left' />
                        <div>This is what food means to me. This is why I love to cook and share it with others.</div>
                        <div className='cooks-cards'>Necole
                            <div>Joyce-Collingwood</div>
                        </div>
                    </Grid.Column>
                    <Grid.Column>
                        <div id='cooks-pic'></div>
                    </Grid.Column>
                </Grid>
                <Grid stackable columns={2} verticalAlign='middle' textAlign='left'>
                    <Grid.Column>
                        <div id='cooks-pic'></div>
                    </Grid.Column>
                    <Grid.Column>
                        <Icon size='big' color='purple' name='quote left' />
                        <div>One of the things that I really love about Turkish food
                        is that it’s very honest and humble. Simple ingredients are transformed into visual
                        masterpieces that sing with flavour.</div>
                        <div className='cooks-cards'>Ayesegul
                            <div>North Vancouver</div>
                        </div>
                    </Grid.Column>
                </Grid>
                <Grid stackable columns={2} verticalAlign='middle' textAlign='right' reversed='mobile'>
                    <Grid.Column>
                        <Icon size='big' color='purple' name='quote left' />
                        <div>This is what food means to me. This is why I love to cook and share it with others. </div>
                        <div className='cooks-cards'>Maria
                            <div>West End</div>
                        </div>
                    </Grid.Column>
                    <Grid.Column>
                        <div id='cooks-pic'></div>
                    </Grid.Column>
                </Grid>
                <Grid stackable columns={2} verticalAlign='middle' textAlign='left'>
                    <Grid.Column>
                        <div id='cooks-pic'></div>
                    </Grid.Column>
                    <Grid.Column>
                        <Icon size='big' color='purple' name='quote left' />
                        <div>Filipino food is meant to be shared!</div>
                        <div className='cooks-cards'>Missy
                            <div>Burnaby</div>
                        </div>
                    </Grid.Column>
                </Grid>
                <Grid stackable columns={2} verticalAlign='middle' textAlign='right' reversed='mobile'>
                    <Grid.Column>
                        <Icon size='big' color='purple' name='quote left' />
                        <div>This is what food means to me. This is why I share my cooking. </div>
                        <div className='cooks-cards'>Barbara
                            <div>Yaletown</div>
                        </div>
                    </Grid.Column>
                    <Grid.Column>
                        <div id='cooks-pic'></div>
                    </Grid.Column>
                </Grid>
            </div>

        </InfoPage>
    )
}

export default Cooks;