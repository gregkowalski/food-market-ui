import React from 'react'
import PropTypes from 'prop-types'
import { Image, Dropdown } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import './AppHeader.css'
import Constants from '../Constants'
import Config from '../Config'
import Util from '../services/Util'
import Url from '../services/Url'
import CognitoUtil from '../services/Cognito/CognitoUtil'
import LoadingIcon from './LoadingIcon'

import { Actions, Selectors } from '../store/currentUser'

export class AppHeader extends React.Component {

    tagline;

    componentWillMount() {
        CognitoUtil.setLastPath(window.location.pathname);
        this.props.loadCurrentUser();
        this.tagline = this.getRandomTagline();
    }

    handleSignIn = (e) => {
        e.preventDefault();
        CognitoUtil.redirectToLoginIfNoSession();
    }

    handleSignUp = (e) => {
        e.preventDefault();
        CognitoUtil.redirectToSignupIfNoSession();
    }

    handleLogOut = (event, data) => {
        CognitoUtil.logOut();
        this.props.logOut();
    }

    handleContactSupport = (event, data) => {
        window.location.href = Url.mailTo(Config.Foodcraft.SupportEmail, 'Foodcraft Feedback');
    }

    handleEditProfile = () => {
        const { user } = this.props;
        this.props.history.push(Url.profileEdit(user.user_id));
    }

    handleLogoClick = () => {
        this.props.history.push(Url.home());
    }

    handleMyOrders = () => {
        this.props.history.push(Url.orders());
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
            'making good food taste better',
            'moo.',
            'eat like family',
            'good food starts here.'
        ];

        let index = Util.getRandomInt(0, taglines.length - 1);
        return taglines[index];
    }

    render() {
        const { user, isLoading } = this.props;

        let sessionElement;

        if (user) {
            sessionElement =
                <div className='apphead-sign-in'>
                    <span>Hi, </span>
                    <Dropdown text={user.username}>
                        <Dropdown.Menu className='left'>
                            <Dropdown.Item className='apphead-dropdown-profile-link' text='My Orders' onClick={this.handleMyOrders} />
                            <Dropdown.Divider />
                            <Dropdown.Item className='apphead-dropdown-profile-link' text='Edit Profile' onClick={this.handleEditProfile} />
                            <Dropdown.Divider />
                            <Dropdown.Item className='apphead-dropdown-item' text='Contact Support' onClick={this.handleContactSupport} />
                            <Dropdown.Divider />
                            <Dropdown.Item className='apphead-dropdown-item' text='Log Out' onClick={this.handleLogOut} />
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
        }
        else {
            if (isLoading) {
                sessionElement =
                    <div className='apphead-sign-in'>
                        <LoadingIcon />
                    </div>
            }
            else {
                sessionElement =
                    <div>
                        <a href='/signup' onClick={this.handleSignUp} className='apphead-sign-in'> Sign Up </a>
                        <span style={{ color: '#2da388', fontSize: '1.5em', marginTop: '2px' }}>|</span>
                        <a href='/login' onClick={this.handleSignIn} className='apphead-sign-in'> Log In</a>
                    </div>
            }
        }
        const headerStyle = {};
        headerStyle.position = 'relative';
        if (this.props.fixed) {
            headerStyle.position = 'fixed';
        }

        headerStyle.borderBottom = '1px solid rgb(201, 199, 199)';
        if (!this.props.noshadow) {
            headerStyle.boxShadow = '0px 3px 5px rgba(85, 85, 85, 0.603)';
        }

        return (

            <div className='apphead' style={headerStyle}>
                <div className='apphead-content'>
                    <div className='apphead-logo'>
                        <div onClick={this.handleLogoClick}>
                            <Image height='38px' src={Constants.AppLogo} />
                            <div className='apphead-link'>{Constants.AppName}</div>
                        </div>
                        <div className="content-desktop">
                            {this.tagline}
                        </div>
                    </div>
                    <div className='apphead-right'>
                        <div style={{ marginTop: '12px' }}>
                            {sessionElement}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: Selectors.getCurrentUser(state),
        isLoading: Selectors.getIsLoading(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadCurrentUser: () => dispatch(Actions.loadCurrentUser()),
        logOut: () => dispatch(Actions.logOut()),
    };
};

AppHeader.propTypes = {
    user: PropTypes.shape({
        user_id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
    }),
    isLoading: PropTypes.bool.isRequired,
    loadCurrentUser: PropTypes.func.isRequired,
    logOut: PropTypes.func.isRequired,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppHeader));