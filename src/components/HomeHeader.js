import React from 'react'
import PropTypes from 'prop-types'
import { Image, Dropdown } from 'semantic-ui-react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import './HomeHeader.css'
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
        const { user } = this.props;
        this.props.history.push(Url.profileEdit(user.user_id));
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
            'making good food taste better.',
            'eat like family.',
            'good food starts here.',
            'cooking is love you can taste.'
        ];

        let index = Util.getRandomInt(0, taglines.length - 1);
        return taglines[index];
    }

    render() {
        const { user, isLoading } = this.props;

        let sessionElement;

        if (user) {
            sessionElement = (
                <div className='homehead-sign-in'>
                    <Dropdown icon='angle down' text={'Hi, ' + user.username}>
                        <Dropdown.Menu className='left'>
                            <Dropdown.Item className='homehead-dropdown-link' text='Home' onClick={this.navigateToHome} />
                            <Dropdown.Divider />
                            <Dropdown.Item className='homehead-dropdown-link' text='My Orders' onClick={this.navigateToMyOrders} />
                            <Dropdown.Divider />
                            {user.stripe_user_id &&
                                <Dropdown.Item className='homehead-dropdown-link' text='My Cooking Requests' onClick={this.navigateToMyCookingRequests} />
                            }
                            {user.stripe_user_id &&
                                <Dropdown.Divider />
                            }
                            <Dropdown.Item className='homehead-dropdown-link' text='Edit Profile' onClick={this.navigateToEditProfile} />
                            <Dropdown.Divider />
                            <Dropdown.Item className='homehead-dropdown-item' text='Contact Support' onClick={this.handleContactSupport} />
                            <Dropdown.Divider />
                            <Dropdown.Item className='homehead-dropdown-item' text='Log Out' onClick={this.handleLogOut} />
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            );
        }
        else {
            if (isLoading) {
                sessionElement = (
                    <div className='homehead-sign-in'>
                        <LoadingIcon />
                    </div>
                );
            }
            else {
                sessionElement = (
                    <div>
                        <a href={Url.signup()} onClick={this.handleSignUp} className='homehead-sign-in'> Sign Up </a>
                        <span style={{ color: '#2da388', fontSize: '1.5em', marginTop: '2px' }}>|</span>
                        <a href={Url.login()} onClick={this.handleSignIn} className='homehead-sign-in'> Log In</a>
                    </div>
                );
            }
        }
        const headerStyle = {};
        headerStyle.position = 'relative';
        if (this.props.fixed) {
            headerStyle.position = 'fixed';
        }

        headerStyle.borderBottom = '0px solid rgb(201, 199, 199)';
        if (!this.props.noshadow) {
            headerStyle.boxShadow = '0px 0px 0px rgba(85, 85, 85, 0.603)';
        }

        return (
            <div className='homehead' style={headerStyle}>
                <div className='homehead-content'>
                    <div className='homehead-logo'>
                        <div onClick={this.navigateToHome}>
                            <Image height='38px' src={Constants.AppLogo} />
                            <div className='homehead-link'>{Constants.AppName}</div>
                        </div>
                        <div className="homehead-desktop">
                            <Link to={Url.howto()}>How It Works</Link>
                            <div>·</div>
                            <Link to={Url.whycook()}>Become A Cook</Link>
                        </div>
                    </div>
                    <div className='homehead-right'>
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