import React from 'react'
import PropTypes from 'prop-types'
import { Image, Dropdown } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import './AppHeader.css'
import Constants from '../Constants'
import Config from '../Config'
import Util from '../services/Util'
import CognitoUtil from '../services/Cognito/CognitoUtil'
import LoadingIcon from './LoadingIcon'

import { Actions, Selectors } from '../store/currentUser'

export class AppHeader extends React.Component {

    tagline;

    componentWillMount() {
        CognitoUtil.setLastPathname(window.location.pathname);
        this.props.loadCurrentUser();
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

    handleLogOut(event, data) {
        CognitoUtil.logOut();
        this.props.logOut();
    }

    handleContactSupport(event, data) {
        window.location.href = `mailto:<${Config.Foodcraft.SupportEmail}>?subject=${encodeURIComponent('Foodcraft Feedback')}`;
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
                        <Dropdown.Menu className='left' style={{ width: '250px' }}>
                            <Dropdown.Item className='apphead-dropdown-profile-link' text='Edit Profile' onClick={() => this.props.history.push(`/profile/edit/${user.user_id}`)} />
                            <Dropdown.Divider />
                            <Dropdown.Item className='apphead-dropdown-item' text='Contact Support' onClick={(event, data) => this.handleContactSupport(event, data)} />
                            <Dropdown.Divider />
                            <Dropdown.Item className='apphead-dropdown-item' text='Log Out' onClick={(event, data) => this.handleLogOut(event, data)} />
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
                        <a href='/signup' onClick={(e) => this.handleSignUp(e)} className='apphead-sign-in'> Sign Up </a>
                        <span style={{ color: '#4cb9a0', fontSize: '1.5em', marginTop: '2px' }}>|</span>
                        <a href='/login' onClick={(e) => this.handleSignIn(e)} className='apphead-sign-in'> Log In</a>
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
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppHeader));