import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Divider, Grid, Image } from 'semantic-ui-react'
import './AppFooter.css'
import Constants from '../Constants'
import Url from '../services/Url'
import Util from '../services/Util'

class AppFooter extends React.Component {

    render() {

        return (
            <div className='appfooter'>
                <Divider />
                <Grid verticalAlign='top'>
                    <Grid.Column width={8}>
                        <Link to={Url.about()}>About</Link>
                        <Link to={Url.policies()}>Policies</Link>
                        <Link to={Url.terms()}>Terms and conditions</Link>
                        <Link to={Url.help()}>Help</Link>
                    </Grid.Column>
                    <Grid.Column width={7}>
                        <Link to={Url.safety()}>Trust &amp; Safety</Link>
                        <Link to={Url.cookies()}>Cookies</Link>
                        <Link to={Url.privacy()}>Privacy</Link>
                        <a href={Util.contactSupportUrl()}>Support</a>
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