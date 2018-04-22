import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Divider, Grid, Image } from 'semantic-ui-react'
import './AppFooter.css'
import { Constants } from '../Constants'
import Url from '../services/Url'
import Util from '../services/Util'

class AppFooter extends React.Component {
 
    render() {

        return (
            <div className='appfooter'>
                <Divider />
                <Grid verticalAlign='top'>
                    <Grid.Column width={5}>
                        <Link to={Url.about()}>What is foodcraft?</Link>
                        <Link to={Url.policies()}>Policies</Link>
                        <Link to={Url.terms()}>Terms + Conditions</Link>
                        {/* <Link to={Url.privacy()}>Privacy</Link>                         */}
                    </Grid.Column>
                    <Grid.Column width={5}>
                        <Link to={Url.about()}>How It Works</Link> 
                        <Link to={Url.community()}>Our Community</Link>                                                                                    
                        <Link to={Url.safety()}>Food Safety</Link>                                                            
                    </Grid.Column>
                    <Grid.Column width={5}>
                    <Link to={Url.help()}>The Help Center</Link>                    
                        {/* <Link to={Url.cookies()}>Cookies</Link> */}
                        <a href={Util.contactSupportUrl()}>Contact Support</a>
                    </Grid.Column>
                </Grid>
                <Divider />
                <div className='appfooter-logo'>
                    <Image src={Constants.AppLogo} />
                    <div>&copy; 2018 {Util.titleCase(Constants.AppName)}, Inc.</div>
                </div>
            </div>
        );
    }
}

export default withRouter(AppFooter);