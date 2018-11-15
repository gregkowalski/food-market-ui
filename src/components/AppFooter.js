import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Divider, Grid, Image, Icon } from 'semantic-ui-react'
import './AppFooter.css'
import { Constants } from '../Constants'
import Url from '../services/Url'
import Util from '../services/Util'

class AppFooter extends React.Component {

    render() {

        return (
            <div className='appfooter'>
                <Divider hidden />
                <Grid verticalAlign='top' doubling columns={4} >
                    <Grid.Column>
                        <div className='appfooter-header'>Foodcraft</div>
                        <Link to={Url.about()}>About</Link>
                        {/* <Link to={Url.policies()}>Policies</Link>   */}
                        <Link to={Url.terms()}>Terms</Link>
                        <Link to={Url.privacy()}>Privacy</Link>                                              
                    </Grid.Column>
                    <Grid.Column>
                    <div className='appfooter-header'>Community</div>                        
                        <Link to={Url.howto()}>How It Works</Link>
                        <Link to={Url.whycook()}>Be a cook</Link>                                                
                        <Link to={Url.cooks()}>Local Cooks</Link>                        
                    {/* <Link to={Url.community()}><span className='appfooter-mobile-title'>Our </span>Community</Link>                                             */}
                    </Grid.Column>
                    <Grid.Column>
                    <div className='appfooter-header'>Help</div>                                                
                        <Link to={Url.help()}><span className='appfooter-mobile-title'>The </span>Help Center</Link>
                        {/* <Link to={Url.safety()}>Food Safety</Link>                         */}
                        <a href={Util.contactSupportUrl()}>Support</a>
                    </Grid.Column>
                    <Grid.Column>
                    <div className='appfooter-header'>Follow us</div>                                                                        
                    <div className='appfooter-social'>
                    <a href='https://www.instagram.com/foodcraftvancity/'><Icon name='instagram'/></a>
                    <a href='https://twitter.com/foodcraftvan'><Icon name='twitter'/></a>
                    <a href='https://medium.com/@foodcraftvancity'><Icon name='medium'/></a>
                    </div>
                    </Grid.Column>
                </Grid>
                <Divider id='appfooter-divider'/>
                <div className='appfooter-logo'>
                    <Image src={Constants.AppLogo} />
                    <div className='appfooter-name'>&copy; 2018 {Constants.AppName}, Inc.</div>
                </div>
            </div>
        );
    }
}

export default withRouter(AppFooter);