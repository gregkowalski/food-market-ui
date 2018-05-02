import React from 'react'
import PropTypes from 'prop-types'
import { Image, Dropdown } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import './AppHeader.css'
import { Constants } from '../Constants'
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

    handleContactSupport = () => {
        Util.contactSupport();
    }

    navigateToEditProfile = () => {
        this.props.history.push(Url.profileEdit());
    }

    navigateToMyOrders = () => {
        this.props.history.push(Url.buyerOrders());
    }

    navigateToMyCookingRequests = () => {
        this.props.history.push(Url.cookOrders());
    }

    navigateToHome = () => {
        this.props.history.push(Url.home());
    }

    getRandomTagline() {

        const taglines = [
            'handcrafted to taste like home.',
            'homemade + local',
            'this is...awesomesauce!',
            'because being hangry was so 2017.',
            'easy peasy, lemon squeezy!',
            'so hot right now.',
            'home of the best kebab.',
            'making good food taste better.',
            'moo.',
            'eat like family.',
            'good food starts here.',
            'cooking is love you can taste.',
            'from kitchen to table.'
        ];

        let index = Util.getRandomInt(0, taglines.length - 1);
        return taglines[index];
    }

    render() {
        const { user, isLoading } = this.props;

        let sessionElement;

        if (user) {
            sessionElement = (
                <div className='apphead-sign-in'>
                    <Dropdown icon='angle down' text={'Hi, ' + user.username}>
                        <Dropdown.Menu className='left'>
                            <Dropdown.Item className='apphead-dropdown-link' text='Home' onClick={this.navigateToHome} />
                            <Dropdown.Divider />
                            <Dropdown.Item className='apphead-dropdown-link' text='My Orders' onClick={this.navigateToMyOrders} />
                            <Dropdown.Divider />
                            {user.stripe_account_id &&
                                <Dropdown.Item className='apphead-dropdown-link' text='My Cooking Requests' onClick={this.navigateToMyCookingRequests} />
                            }
                            {user.stripe_account_id &&
                                <Dropdown.Divider />
                            }
                            <Dropdown.Item className='apphead-dropdown-link' text='Edit Profile' onClick={this.navigateToEditProfile} />
                            <Dropdown.Divider />
                            <Dropdown.Item className='apphead-dropdown-item' text='Contact Support' onClick={this.handleContactSupport} />
                            <Dropdown.Divider />
                            <Dropdown.Item className='apphead-dropdown-item' text='Log Out' onClick={this.handleLogOut} />
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            );
        }
        else {
            if (isLoading) {
                sessionElement = (
                    <div className='apphead-sign-in'>
                        <LoadingIcon />
                    </div>
                );
            }
            else {
                sessionElement = (
                    <div>
                        <a href={Url.signup()} onClick={this.handleSignUp} className='apphead-sign-in'> Sign Up </a>
                        <span style={{ color: '#2da388', fontSize: '1.5em', marginTop: '2px' }}>|</span>
                        <a href={Url.login()} onClick={this.handleSignIn} className='apphead-sign-in'> Log In</a>
                    </div>
                );
            }
        }
        const headerStyle = {};
        headerStyle.position = 'relative';
        if (this.props.fixed) {
            headerStyle.position = 'fixed';
        }

        headerStyle.borderBottom = '1px solid rgb(225, 225, 225)';
        if (!this.props.noshadow) {
            headerStyle.boxShadow = '0px 0px 8px rgba(88, 88, 88, 0.603)';
        }

        return (
            <div className='apphead' style={headerStyle}>
                <div className='apphead-content'>
                    <div className='apphead-logo'>
                        <div onClick={this.navigateToHome}>
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
        user: Selectors.currentUser(state),
        isLoading: Selectors.isLoading(state)
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