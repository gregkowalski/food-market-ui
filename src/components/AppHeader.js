import React from 'react'
import { Image, Dropdown, Icon, Button } from 'semantic-ui-react'
import { Constants } from '../Constants'
import './AppHeader.css'
import {
    AWSCognito,
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails,
    CognitoIdToken,
    CognitoAccessToken,
    CognitoUserSession,
    CognitoRefreshToken
} from 'amazon-cognito-identity-js';
import CognitoUtil from '../CognitoUtil'
import jwtDecode from 'jwt-decode'
import apigClientFactory from 'aws-api-gateway-client'
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';

export default class AppHeader extends React.Component {

    state = {};
    cognitoLoginUrl;

    initCognitoSDK() {
        var authData = {
            ClientId: 'dqkgel75ifc13rtlih1hooril',
            AppWebDomain: 'local-cosmo-test.auth.us-west-2.amazoncognito.com',
            TokenScopesArray: ['openid', 'profile', 'aws.cognito.signin.user.admin', 'email'],
            RedirectUriSignIn: 'http://localhost:3000/cognitoCallback',
            RedirectUriSignOut: 'http://localhost:3000/cognitoSignout',
            UserPoolId: 'us-west-2_mprqsYkPx',
            // IdentityProvider : '<TODO: your identity provider you want to specify here>',
            // AdvancedSecurityDataCollectionFlag : <TODO: boolean value indicating whether you want to enable advanced security data collection>
        };
        var auth = new CognitoAuth(authData);
        auth.userhandler = {
            onSuccess: (result) => {
                console.log("userhandler: Sign in success");
            },
            onFailure: (err) => {
                console.error("userhandler: Error!" + err);
            }
        };
        // The default response_type is "token", uncomment the next line will make it be "code".
        //auth.useCodeGrantFlow();
        return auth;
    }

    handleSignIn() {
        let auth = this.initCognitoSDK();
        auth.getSession();
    }

    handleSignOut() {
        let auth = this.initCognitoSDK();
        let session = auth.getCachedSession();
        if (session && session.isValid()) {
            auth.signOut();
        }

        this.setState({ username: null });
    }

    componentWillMount() {

        console.log(`location=${location}, location.pathname=${location.pathname}`);
        CognitoUtil.setLastPathname(location.pathname);

        //this.cognitoLoginUrl = CognitoUtil.getCognitoLoginUrl();

        let auth = this.initCognitoSDK();
        let session = auth.getCachedSession();
        if (session && session.isValid()) {
            const jwt = jwtDecode(session.getIdToken().getJwtToken());
            this.setState({ username: jwt.preferred_username });
        }

        // const cognitoAuth = CognitoUtil.getCognitoAuth();
        // if (cognitoAuth) {
        //     const idToken = new CognitoIdToken({ IdToken: cognitoAuth.id_token });
        //     const accessToken = new CognitoAccessToken({ AccessToken: cognitoAuth.access_token });
        //     const refreshToken = new CognitoRefreshToken({ RefreshToken: null });
        //     const tokenData = {
        //         IdToken: idToken,
        //         AccessToken: accessToken,
        //         RefreshToken: refreshToken
        //     };
        //     const session = new CognitoUserSession(tokenData);
        //     console.log('valid session? ' + session.isValid());

        //     const jwt = jwtDecode(cognitoAuth.id_token);
        //     // var x = {
        //     //     "sub": "b8218b57-3298-41df-b471-9a1e3c615220",
        //     //     "email_verified": true,
        //     //     "iss": "https://cognito-idp.us-west-2.amazonaws.com/us-west-2_mprqsYkPx",
        //     //     "phone_number_verified": false,
        //     //     "cognito:username": "b8218b57-3298-41df-b471-9a1e3c615220",
        //     //     "preferred_username": "gregk+5",
        //     //     "aud": "dqkgel75ifc13rtlih1hooril",
        //     //     "token_use": "id",
        //     //     "auth_time": 1514425018,
        //     //     "phone_number": "+16041112222",
        //     //     "exp": 1514428618,
        //     //     "iat": 1514425018,
        //     //     "email": "gregkowalski+5@gmail.com"
        //     // };

        //     let userPool = new CognitoUserPool(CognitoUtil.getUserPoolData());

        //     const userData = {
        //         Username: jwt.email,
        //         Pool: userPool
        //     };

        //     let cognitoUser = new CognitoUser(userData);
        //     cognitoUser.setSignInUserSession(session);

        //     var config = {
        //         region: 'us-west-2',
        //         invokeUrl: 'https://be.cosmo-test.com/v1'
        //     };
        //     let apigClient = apigClientFactory.newClient(config);
        //     var additionalParams = {
        //         //If there are any unmodeled query parameters or headers that need to be sent with the request you can add them here
        //         headers: {
        //             'X-FOOD-MARKET-JWT': cognitoAuth.id_token
        //         },
        //     };
        //     console.log('Calling API...');
        //     apigClient.invokeApi(null, '/fooditems', 'GET', additionalParams)
        //         .then(response => {
        //             console.log('Call API success!!!');
        //             console.log(JSON.stringify(response.data));
        //             console.log(response.data.message);
        //         }).catch(result => {
        //             //This is where you would put an error callback
        //             console.error('Call API failed!!!');
        //             console.log(JSON.stringify(result));
        //         });


        //     cognitoUser.getUserAttributes((err, attributes) => {
        //         if (err) {
        //             console.error(err);
        //         } else {
        //             console.log(JSON.stringify(attributes));
        //         }
        //     });
        // }
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
                    <a href='#' onClick={() => this.handleSignOut()} style={{ color: 'teal' }}> <Icon name='user outline' />Log Out</a>
                </span>
        }
        else {
            sessionElement =
                <a href='#' onClick={() => this.handleSignIn()} style={{ color: 'teal' }}> <Icon name='user outline' />Log In</a>
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
