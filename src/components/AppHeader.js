import React from 'react'
import { Image, Dropdown, Icon } from 'semantic-ui-react'
import { Constants } from '../Constants'
import './AppHeader.css'
import CognitoUtil from '../CognitoUtil'
import jwtDecode from 'jwt-decode'
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';

export default class AppHeader extends React.Component {

    state = {};
    cognitoLoginUrl;

    handleSignIn(e) {
        e.preventDefault();

        let auth = new CognitoAuth(CognitoUtil.getCognitoAuthData());
        auth.getSession();
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
        console.log(`location=${location}, location.pathname=${location.pathname}`);
        CognitoUtil.setLastPathname(location.pathname);

        let auth = new CognitoAuth(CognitoUtil.getCognitoAuthData());
        let session = auth.getCachedSession();
        if (session && session.isValid()) {
            const jwt = jwtDecode(session.getIdToken().getJwtToken());
            this.setState({ username: jwt.preferred_username });
        }
    }

    render() {
        let pos = 'relative';
        if (this.props.fixed) {
            pos = 'fixed';
        }

        let sessionElement;
        if (this.state.username) {
            sessionElement =
                <span>Hello, {this.state.username}
                    <a href='' onClick={(e) => this.handleSignOut(e)} style={{ color: 'teal' }}> <Icon name='user outline' />Log Out</a>
                </span>
        }
        else {
            sessionElement =
                <a href='' onClick={(e) => this.handleSignIn(e)} style={{ color: 'teal' }}> <Icon name='user outline' />Log In</a>
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
                        local. homemade. wholesome. 
                        </div>
                    </div>
                    <div className='head-right'>
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
                        {sessionElement}
                    </div>
                </div>
            </div>
        );
    }
}
