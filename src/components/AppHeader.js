import React from 'react'
import { Image, Dropdown } from 'semantic-ui-react'
import { Constants } from '../Constants'
import './AppHeader.css'
import CognitoUtil from '../Cognito/CognitoUtil'
import jwtDecode from 'jwt-decode'
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';
import { withRouter } from 'react-router-dom'
import { FeatureToggles } from '../FeatureToggles'

class AppHeader extends React.Component {

    state = {};
    tagline;

    handleSignIn(e) {
        e.preventDefault();
        CognitoUtil.redirectToLoginIfNoSession();
    }

    handleSignUp(e) {
        e.preventDefault();
        CognitoUtil.redirectToSignupIfNoSession();
    }

    handleSignOut(e) {
        e.preventDefault();

        let auth = new CognitoAuth(CognitoUtil.getCognitoAuthData());
        let session = auth.getCachedSession();
        if (session && session.isValid()) {
            auth.signOut();
        }

        this.setState({ username: null });
    }

    componentWillMount() {
        //console.log(`location=${location}, location.pathname=${location.pathname}`);
        CognitoUtil.setLastPathname(location.pathname);

        let auth = new CognitoAuth(CognitoUtil.getCognitoAuthData());
        let session = auth.getCachedSession();
        if (session && session.isValid()) {
            const jwt = jwtDecode(session.getIdToken().getJwtToken());
            this.setState({ username: jwt.preferred_username });
        }

        this.tagline = this.getRandomTagline();
    }

    handleLogOut(event, data) {
        let auth = new CognitoAuth(CognitoUtil.getCognitoAuthData());
        let session = auth.getCachedSession();
        if (session && session.isValid()) {
            auth.signOut();
        }

        this.setState({ username: null });
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getRandomTagline() {

        const taglines = [
            'handcrafted to taste like home',
            'homemade + local',
            'this is...awesomesauce!',
            'because being hangry was so 2017.',
            'easy peasy, lemon squeezy!',
            'so hot right now.'
        ];
        let index = this.getRandomInt(0, taglines.length - 1);
        return taglines[index];
    }

    render() {
        let pos = 'relative';
        if (this.props.fixed) {
            pos = 'fixed';
        }

        const featureToggle = FeatureToggles.CognitoLogin;

        let sessionElement;
        if (featureToggle) {
            if (this.state.username) {
                sessionElement =
                    <div className='apphead-sign-in'>
                        <span>Hi, </span>
                        <Dropdown text={this.state.username} >
                            <Dropdown.Menu className='left' style={{ width: '250px' }}>
                                <Dropdown.Item className='apphead-dropdown-profile-link' text='View Profile' onClick={() => this.props.history.push('/profile/1')} />
                                <Dropdown.Divider />
                                <Dropdown.Item className='apphead-dropdown-item' text='Log Out' onClick={(event, data) => this.handleLogOut(event, data)} />
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
            }
            else {
                sessionElement =
                    <div>
                        <a href='#' onClick={(e) => this.handleSignUp(e)} className='apphead-sign-in'> Sign Up </a>
                        <span style={{ color: '#4cb9a0', fontSize: '1.5em', marginTop: '2px' }}>|</span>
                        <a href='#' onClick={(e) => this.handleSignIn(e)} className='apphead-sign-in'> Log In</a>

                    </div>
            }
        }

        return (
            <div className='apphead' style={{ position: pos }}>
                <div className='apphead-content'>
                    <div className='apphead-logo'>
                        <a href="/">
                            <Image style={{ marginTop: '9.5px' }} height='22px' src={Constants.AppLogo} />
                        </a>
                        <a href="/" className='apphead-link'>
                            <div>{Constants.AppName}</div>
                        </a>
                        <div className="content-desktop">
                            {this.tagline}
                        </div>
                    </div>
                    <div className='apphead-right'>
                        {!featureToggle &&
                            <Dropdown text='filter' icon='search' floating labeled button closeOnChange className='icon'>
                                <Dropdown.Menu>
                                    <Dropdown.Header icon='tags' content='Filter by tag' />
                                    <Dropdown.Divider />
                                    <Dropdown.Item icon='checkmark box' text='Cooked' />
                                    <Dropdown.Item icon='fire' text='Uncooked' />
                                    <Dropdown.Item icon='snowflake outline' text='Frozen' />
                                    <Dropdown.Item icon='shopping basket' text='Ingredient' />
                                    <Dropdown.Item icon='motorcycle' text='Delivery' />
                                    <Dropdown.Item icon='hand rock' text='Pick-up' />
                                </Dropdown.Menu>
                            </Dropdown>
                        }
                        {featureToggle &&
                            <div style={{ marginTop: '8px' }}>
                                {sessionElement}
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(AppHeader);