import React from 'react'
import './test.css'
import { Button, Icon, Input, Segment } from 'semantic-ui-react'
import apigClientFactory from 'aws-api-gateway-client'
import {
    //AWSCognito,
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import Cookies from 'universal-cookie';

const JwtCookieName = 'food-market-jwt';
const JwtHeaderName = 'X-FOOD-MARKET-JWT';

class mytest extends React.Component {

    state = {
        messages: ['Loading, please wait...'],
        email: 'gregkowalski+1@gmail.com',
        username: 'gregk+1',
        pwd: 'Password1'
    };

    _apigClient;
    _userPool;
    _authenticatedUser;
    FB;

    componentWillMount() {
        var config = {
            region: 'us-west-2',
            invokeUrl: 'https://be.cosmo-test.com/v1'
        };
        this._apigClient = apigClientFactory.newClient(config);

        var poolData = {
            UserPoolId: 'us-west-2_mprqsYkPx',
            ClientId: 'dqkgel75ifc13rtlih1hooril'
        };
        this._userPool = new CognitoUserPool(poolData);
        this.FB = window.FB;

        // fetch('https://01rdlz5p50.execute-api.us-west-2.amazonaws.com/api/messages', {
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        // })
        //     .then(response => {
        //         return response.json();
        //     })
        //     .then(jsonData => {
        //         console.log(jsonData);
        //         this.setState({ rows: jsonData.rows });
        //     });
    }

    debug(info) {
        console.debug(info);
        this.addMessage(info);
    }

    log(info) {
        console.log(info);
        this.addMessage(info);
    }

    error(info) {
        console.error(info);
        this.addMessage(info);
    }

    addMessage(info) {
        let messages = this.state.messages.slice();
        messages.push(JSON.stringify(info));
        this.setState({ messages: messages });
    }

    handleCallApi(e) {
        this.log('Call API clicked!!!');

        let jwtToken;
        if (this._authenticatedUser) {
            jwtToken = this._authenticatedUser.signInUserSession.idToken.jwtToken;
        }
        else {
            const cookies = new Cookies();
            jwtToken = cookies.get(JwtCookieName);
        }
        var additionalParams = {
            //If there are any unmodeled query parameters or headers that need to be sent with the request you can add them here
            headers: {},
        };
        additionalParams.headers[JwtHeaderName] = jwtToken;

        this._apigClient.invokeApi(null, '/fooditems', 'GET', additionalParams)
            .then(response => {
                this.log('Call API success!!!');
                this.log(JSON.stringify(response.data));
                this.log(response.data.message);
            }).catch(result => {
                //This is where you would put an error callback
                this.error('Call API failed!!!');
                this.log(JSON.stringify(result));
            });
    }

    handleSignup(e) {
        this.log('Signup clicked!!!');
        this.log(JSON.stringify(this.state));

        var attributes = [
            new CognitoUserAttribute({
                Name: 'email',
                Value: this.state.email
            }),
            new CognitoUserAttribute({
                Name: 'phone_number',
                Value: '+16046575354'
            }),
            new CognitoUserAttribute({
                Name: 'preferred_username',
                Value: this.state.username
            }),
        ];

        this._userPool.signUp(this.state.email, this.state.pwd, attributes, null, (err, result) => {
            if (err) {
                this.error(err);
                return;
            }
            var cognitoUser = result.user;
            this.log('user name is ' + cognitoUser.getUsername());
        });
    }

    handleConfirm(e) {
        this.log('Confirm clicked: ' + this.state.confirmcode);

        var userData = {
            Username: this.state.email,
            Pool: this._userPool
        };

        var cognitoUser = new CognitoUser(userData);
        cognitoUser.confirmRegistration(this.state.confirmcode, true, (err, result) => {
            if (err) {
                this.error(err);
                return;
            }
            this.log('call result: ' + result);
        });
    }

    handleResend(e) {
        this.log('Resend clicked!!!');

        var userData = {
            Username: this.state.email,
            Pool: this._userPool
        };

        var cognitoUser = new CognitoUser(userData);
        cognitoUser.resendConfirmationCode((err, result) => {
            if (err) {
                this.error(err);
                return;
            }
            this.log('call result: ' + result);
        });
    }

    handleLogin(e) {
        var authenticationData = {
            Username: this.state.email,
            Password: this.state.pwd,
        };
        var authenticationDetails = new AuthenticationDetails(authenticationData);

        var userData = {
            Username: this.state.email,
            Pool: this._userPool
        };
        var cognitoUser = new CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                this.log('access token + ' + result.getAccessToken().getJwtToken());
                this.log('idToken + ' + result.idToken.jwtToken);
                this.log('Successfully logged!');
                this._authenticatedUser = cognitoUser;

                const cookies = new Cookies();
                if (cookies.get(JwtCookieName)) {
                    cookies.remove(JwtCookieName, { expires: 'Thu, 01 Jan 1970 00:00:00 GMT', path: '/' });
                }
                cookies.set(JwtCookieName, result.idToken.jwtToken, { path: '/' });
            },
            onFailure: (err) => {
                this.error(err);
            },
        });
    }

    handleGetUserAttributes(e) {
        let cognitoUser = this._authenticatedUser;
        if (!cognitoUser) {
            this.log('User is not authenticated!')
            return;
        }

        cognitoUser.getUserAttributes((err, result) => {
            if (err) {
                this.error(err);
                return;
            }
            for (var i = 0; i < result.length; i++) {
                this.log(result[i].getName() + ': ' + result[i].getValue());
            }
        });
    }

    handleForgotPassword(e) {
        if (this._authenticatedUser) {
            this.log('You are already logged in!')
            return;
        }

        var userData = {
            Username: this.state.email,
            Pool: this._userPool
        };
        var cognitoUser = new CognitoUser(userData);
        cognitoUser.forgotPassword({
            onSuccess: (data) => {
                // successfully initiated reset password request
                this.log('CodeDeliveryData from forgotPassword: ' + JSON.stringify(data));
            },
            onFailure: (err) => {
                this.error(err);
            },
        });
    }

    handleUpdatePassword(e) {
        if (this._authenticatedUser) {
            this.log('You are already logged in!')
            return;
        }

        var userData = {
            Username: this.state.email,
            Pool: this._userPool
        };
        var cognitoUser = new CognitoUser(userData);
        cognitoUser.confirmPassword(this.state.confirmcode, this.state.pwd, {
            onSuccess() {
                this.log('Password confirmed!');
            },
            onFailure(err) {
                this.log('Password not confirmed!');
            }
        });
    }

    handleDeleteAccount(e) {
        let cognitoUser = this._authenticatedUser;
        if (!cognitoUser) {
            this.log('User is not authenticated!')
            return;
        }
        cognitoUser.deleteUser((err, result) => {
            if (err) {
                this.error(err);
                return;
            }
            this.log('call result: ' + result);
            this.clearSession();
        });
    }

    handleSignout(e) {
        let cognitoUser = this._authenticatedUser;
        if (!cognitoUser) {
            this.log('User is not authenticated!')
            return;
        }
        cognitoUser.signOut();
        this.clearSession();
        this.log('User has been signed out!');
    }

    clearSession() {
        this._authenticatedUser = null;
        const cookies = new Cookies();
        cookies.remove(JwtCookieName, { expires: 'Thu, 01 Jan 1970 00:00:00 GMT', path: '/' });
    }

    handleFacebookLogin(e) {
        this.log('Facebook login clicked');
        this.checkLoginState({
            onSuccess: () => {
                this.log('Already logged in to facebook');
            },
            onError: () => {
                this.FB.login((response) => {
                    this.debug(response);
                    this.checkLoginState();
                },
                { scope: 'public_profile,email' });
            }
        });
    }

    handleFacebookLogout(e) {
        this.FB.logout((response) => {
            this.log('You logged out of facebook!');
         });
    }

    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
    checkLoginState(callback) {
        this.FB.getLoginStatus((response) => {
            this.statusChangeCallback(response, callback);
        });
    }

    statusChangeCallback(response, callback) {
        this.log('statusChangeCallback');
        this.log(response);
        // The response object is returned with a status field that lets the
        // app know the current login status of the person.
        // Full docs on the response object can be found in the documentation
        // for FB.getLoginStatus().
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            let onSuccess;
            if (callback) {
                onSuccess = callback.onSuccess;
            }
            this.testAPI(onSuccess);
        } else {
            // The person is not logged into your app or we are unable to tell.
            document.getElementById('status').innerHTML = 'Please log ' +
                'into this app.';
            if (callback && callback.onError) {
                callback.onError();
            }
        }
    }

    testAPI(onSuccess) {
        this.log('Welcome!  Fetching your information.... ');
        this.FB.api('/me', (response) => {
            this.log('Successful login for: ' + response.name);
            document.getElementById('status').innerHTML =
                'Thanks for logging in, ' + response.name + '!';
            if (onSuccess) {
                onSuccess();
            }
        });
    }

    handleGoogleLogin(e) {
        this.log('Google login clicked');
    }

    render() {
        let messages = this.state.messages.map((m, i) =>
            <div key={i}>{m}</div>
        );

        return (
            <div style={{ margin: '25px 25px 25px 25px' }}>

                <Segment raised>
                    {messages}
                </Segment>

                <div><Button color='pink' content='Call API' onClick={(e) => this.handleCallApi(e)} /></div>

                <Segment raised>
                    <div><Input placeholder='Email' label='Email' value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} /></div>
                    <div><Input placeholder='Username' label='Username' value={this.state.username} onChange={(e) => this.setState({ username: e.target.value })} /></div>
                    <div><Input placeholder='Password' label='Password' value={this.state.pwd} onChange={(e) => this.setState({ pwd: e.target.value })} /></div>
                    <div>
                        <Button color='black' content='Log In' onClick={(e) => this.handleLogin(e)} />
                        <Button color='black' content='Sign Up' onClick={(e) => this.handleSignup(e)} />
                        <Button color='black' content='Sign Out' onClick={(e) => this.handleSignout(e)} />
                        <Button color='black' content='Forgot Password' onClick={(e) => this.handleForgotPassword(e)} />
                        <Button color='black' content='Delete Account' onClick={(e) => this.handleDeleteAccount(e)} />
                        <Button color='black' content='Update Password' onClick={(e) => this.handleUpdatePassword(e)} />
                    </div>
                </Segment>

                <Segment raised>
                    <Input placeholder='Confirmation code' label='Code' onChange={(e) => this.setState({ confirmcode: e.target.value })} /><Button color='black' content='Resend' onClick={(e) => this.handleResend(e)} />
                    <div><Button color='black' content='Confirm' onClick={(e) => this.handleConfirm(e)} /></div>
                </Segment>

                <Segment raised>
                    <Button color='black' content='Get User Attributes' onClick={(e) => this.handleGetUserAttributes(e)} />
                </Segment>

                <Segment raised>
                    <div style={{ marginBottom: '10px' }}>
                        <Button color='facebook' onClick={(e) => this.handleFacebookLogin(e)}>
                            <Icon name='facebook' /> Facebook
                        </Button>
                        <Button color='facebook' onClick={(e) => this.handleFacebookLogout(e)}>
                            <Icon name='facebook' /> Facebook Logout
                        </Button>
                    </div>
                    <div>
                        <Button color='google plus' onClick={(e) => this.handleGoogleLogin(e)}>
                            <Icon name='google plus' /> Google+
                        </Button>
                    </div>
                    <div id="status"></div>
                </Segment>
            </div >
        );
    }
}

export default mytest;
