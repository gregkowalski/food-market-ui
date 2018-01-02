import React from 'react'
import { Image, Dropdown } from 'semantic-ui-react'
import { Constants } from '../Constants'
import './AppHeader.css'
import CognitoUtil from '../Cognito/CognitoUtil'
import jwtDecode from 'jwt-decode'
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';
import { withRouter } from 'react-router-dom'
import crypto from 'crypto'
import { FeatureToggles } from '../FeatureToggles'

class AppHeader extends React.Component {

    state = {};

    handleSignIn(e) {
        this.handleAuth(e, state => CognitoUtil.getCognitoLoginUrl(state));
    }

    handleSignUp(e) {
        this.handleAuth(e, state => CognitoUtil.getCognitoSignUpUrl(state));
    }

    handleAuth(e, getAuthUrl) {
        e.preventDefault();

        let auth = new CognitoAuth(CognitoUtil.getCognitoAuthData());
        let session = auth.getCachedSession();
        if (!session || !session.isValid()) {
            const state = crypto.randomBytes(64).toString('hex');
            CognitoUtil.setCsrfState(state);
            let url = getAuthUrl(state);
            window.open(url, '_self');
        }
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
    }

    handleLogOut(event, data) {
        let auth = new CognitoAuth(CognitoUtil.getCognitoAuthData());
        let session = auth.getCachedSession();
        if (session && session.isValid()) {
            auth.signOut();
        }

        this.setState({ username: null });
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
                    <div className='head-sign-in'>
                        <span>Hi, </span>
                        <Dropdown text={this.state.username} >
                            <Dropdown.Menu className='left' style={{ width: '250px' }}>
                                <Dropdown.Item className='head-dropdown-profile-link' text='View Profile' onClick={() => this.props.history.push('/profile/1')} />
                                <Dropdown.Divider />
                                <Dropdown.Item className='head-dropdown-item' text='Log Out' onClick={(event, data) => this.handleLogOut(event, data)} />
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
            }
            else {
                sessionElement =
                    <div>
                        <a href='#' onClick={(e) => this.handleSignUp(e)} className='head-sign-in'> Sign Up </a>
                        <span style={{color: '#4cb9a0', fontSize: '1.5em', marginTop: '2px' }}>|</span>
                        <a href='#' onClick={(e) => this.handleSignIn(e)} className='head-sign-in'> Log In</a>

                    </div>
            }
        }

        return (
            <div className='head' style={{ position: pos }}>
                <div className='head-content'>
                    <div className='head-logo'>
                        <a href="/">
                            <Image style={{ marginTop: '9.5px' }} height='22px' src='/assets/images/bowlcity8.png' />
                        </a>
                        <a href="/" className='head-link'>
                            <div style={{ marginTop: '10px', fontSize: '1.4em', fontWeight: 'bolder' }}>{Constants.AppName}</div>
                        </a>
                        <div className="content-desktop">
                            homemade. local. wholesome.
                        </div>
                    </div>
                    <div className='head-right'>
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