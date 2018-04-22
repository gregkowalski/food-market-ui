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
                <Divider />
                <Grid verticalAlign='top'>
                    <Grid.Column width={4}>
                        {/* <div className='appfooter-header'>Foodcraft</div> */}
                        <Link to={Url.about()}>what is foodcraft</Link>
                        <Link to={Url.terms()}>Terms</Link>
                        <Link to={Url.privacy()}>Privacy</Link>  
                        <Link to={Url.policies()}>Policies</Link>                                              
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Link to={Url.about()}>How It Works</Link>
                        <Link to={Url.whycook()}>Become A Cook</Link>                        
                        <Link to={Url.safety()}>Food Safety</Link>
                    </Grid.Column>
                    <Grid.Column width={4}>
                    <Link to={Url.community()}>Our Community</Link>                    
                        <Link to={Url.help()}>The Help Center</Link>
                        {/* <Link to={Url.cookies()}>Cookies</Link> */}
                        <a href={Util.contactSupportUrl()}>Support</a>
                    </Grid.Column>
                    <Grid.Column width={4}>
                    <div className='appfooter-social'>
                    <a href='https://www.instagram.com/foodcraftvancity/'><Icon name='instagram'/></a>
                    <a href='https://twitter.com/foodcraftvan'><Icon name='twitter'/></a>
                    <a href='https://medium.com/@foodcraftvancity'><Icon name='medium'/></a>
                    </div>
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