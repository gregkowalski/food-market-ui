import React from 'react'
import { Image, Dropdown } from 'semantic-ui-react'
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';
import { withRouter } from 'react-router-dom'
import './AppHeader.css'
import { Constants } from '../Constants'
import Config from '../Config'
import CognitoUtil from '../Cognito/CognitoUtil'
import ApiClient from '../Api/ApiClient'
import LoadingIcon from './LoadingIcon'

class AppHeader extends React.Component {

    state = {
        loadingUser: false
    };
    tagline;

    componentWillMount() {
        CognitoUtil.setLastPathname(window.location.pathname);
        if (CognitoUtil.isLoggedIn()) {
            let api = new ApiClient();
            this.setState({ loadingUser: true });
            api.getCurrentUser()
                .then(response => {
                    const user = response.data;
                    this.setState({
                        username: user.username,
                        userId: user.user_id,
                        loadingUser: false
                    });

                })
                .catch(err => {
                    this.setState({ loadingUser: false });
                    console.error(err);
                });
        }

        this.tagline = this.getRandomTagline();
    }

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

    handleLogOut(event, data) {
        let auth = new CognitoAuth(CognitoUtil.getCognitoAuthData());
        let session = auth.getCachedSession();
        if (session && session.isValid()) {
            auth.signOut();
        }

        this.setState({ username: null });
    }

    handleContactSupport (event, data) {
        window.location.href = `mailto:<${Config.Foodcraft.SupportEmail}>?subject=${encodeURIComponent('Foodcraft Feedback')}`;
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
            'so hot right now.',
            'home of the best kebab.',
            'making good food taste better.',
            'moo.'
        ];
        let index = this.getRandomInt(0, taglines.length - 1);
        return taglines[index];
    }

    render() {
        let pos = 'relative';
        if (this.props.fixed) {
            pos = 'fixed';
        }

        let sessionElement;
        if (this.state.username) {
            sessionElement =
                <div className='apphead-sign-in'>
                    <span>Hi, </span>
                    <Dropdown text={this.state.username}>
                        <Dropdown.Menu className='left' style={{ width: '250px' }}>
                            <Dropdown.Item className='apphead-dropdown-profile-link' text='Edit Profile' onClick={() => this.props.history.push(`/profile/edit/${this.state.userId}`)} />
                            <Dropdown.Divider />
                            <Dropdown.Item className='apphead-dropdown-item' text='Contact Support' onClick={(event, data) => this.handleContactSupport(event, data)} />
                            <Dropdown.Divider />
                            <Dropdown.Item className='apphead-dropdown-item' text='Log Out' onClick={(event, data) => this.handleLogOut(event, data)} />
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
        }
        else {
            if (this.state.loadingUser) {
                sessionElement =
                    <div className='apphead-sign-in'>
                        <LoadingIcon />
                    </div>
            }
            else {
                sessionElement =
                    <div>
                        <a href='/signup' onClick={(e) => this.handleSignUp(e)} className='apphead-sign-in'> Sign Up </a>
                        <span style={{ color: '#4cb9a0', fontSize: '1.5em', marginTop: '2px' }}>|</span>
                        <a href='/login' onClick={(e) => this.handleSignIn(e)} className='apphead-sign-in'> Log In</a>
                    </div>
            }
        }

        return (
            <div className='apphead' style={{ position: pos }}>
                <div className='apphead-content'>
                    <div className='apphead-logo'>
                        <a href="/">
                            <Image style={{ marginTop: '4px' }} height='30px' src={Constants.AppLogo} />
                        </a>
                        <a href="/" className='apphead-link'>
                            <div>{Constants.AppName}</div>
                        </a>
                        <div className="content-desktop">
                            {this.tagline}
                        </div>
                    </div>
                    <div className='apphead-right'>
                        <div style={{ marginTop: '8px' }}>
                            {sessionElement}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(AppHeader);