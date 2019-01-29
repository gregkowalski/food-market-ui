import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth'
import { CognitoUserPool, CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import crypto from 'crypto'
import jwtDecode from 'jwt-decode'
import Config from '../../Config'
import { Constants } from '../../Constants'
import store from 'store'

class CognitoUtil {

    getCognitoAuthData() {
        var authData = {
            ClientId: Config.Cognito.ClientAppId,
            AppWebDomain: Config.Cognito.AppWebDomain,
            TokenScopesArray: Config.Cognito.TokenScopesArray,
            RedirectUriSignIn: Config.Cognito.RedirectUriSignIn,
            RedirectUriSignOut: Config.Cognito.RedirectUriSignOut,
            UserPoolId: Config.Cognito.UserPoolId,
        };
        return authData;
    }

    getUserPoolData() {
        return {
            UserPoolId: Config.Cognito.UserPoolId,
            ClientId: Config.Cognito.ClientAppId
        };
    }

    getCognitoUser() {
        const jwt = this.getLoggedInUserJwt();
        const userPool = new CognitoUserPool(this.getUserPoolData());
        const userData = {
            Pool: userPool,
            Username: jwt['cognito:username']
        };
        return new CognitoUser(userData);
    }

    getTokenScopesQueryParam() {
        return this.getCognitoAuthData().TokenScopesArray.join('+');
    }

    isAdmin() {
        const jwt = this.getLoggedInUserJwt();
        if (!jwt) {
            return false;
        }
        const groups = jwt['cognito:groups'];
        if (!groups) {
            return false;
        }
        const isAdmin = groups.includes('admin');
        return isAdmin;
    }

    getSessionKey(jwt) {
        return `CognitoIdentityServiceProvider.${Config.Cognito.ClientAppId}.${jwt['cognito:username']}.sessionExpiry`;
    }

    storeSessionExpiry() {
        const jwt = this.getLoggedInUserJwt();
        if (!jwt)
            return;

        const key = this.getSessionKey(jwt);
        store.set(key, jwt.exp);
    }

    hasSessionExpiry() {
        const jwt = this.getLoggedInUserJwt();
        if (!jwt)
            return false;

        const key = this.getSessionKey(jwt);
        const value = store.get(key);
        return value !== undefined;
    }

    getLoggedInUserJwtToken() {
        let auth = new CognitoAuth(this.getCognitoAuthData());
        let session = auth.getCachedSession();
        if (session && session.isValid()) {
            return session.getIdToken().getJwtToken();
        }
        return null;
    }

    isExternalIdp(jwt) {
        if (!jwt.identities) {
            return false;
        }
        if (jwt.identities.length > 0) {
            let providerName = jwt.identities[0].providerName;
            if (providerName === "Google" || providerName === "Facebook") {
                return true;
            }
        }
        return false;
    }

    isEmailVerified(jwt) {
        if (jwt.email_verified) {
            return true;
        }
        return this.isExternalIdp(jwt);
    }

    getLoggedInUserJwt() {
        const jwtToken = this.getLoggedInUserJwtToken();
        if (jwtToken) {
            return jwtDecode(jwtToken);
        }
        return null;
    }

    isLoggedIn() {
        const auth = new CognitoAuth(this.getCognitoAuthData());
        const session = auth.getCachedSession();
        return (session && session.isValid());
    }

    logOut() {
        const auth = new CognitoAuth(this.getCognitoAuthData());
        const session = auth.getCachedSession();
        if (session && session.isValid()) {
            auth.signOut();
        }
        else {
            this.redirectToLogin();
        }
    }

    redirectToLoginIfNoSession() {
        this.redirectIfNoSession(state => this.getCognitoLoginUrl(state));
    }

    redirectToSignupIfNoSession() {
        this.redirectIfNoSession(state => this.getCognitoSignUpUrl(state));
    }

    redirectIfNoSession(getUrl) {
        if (!this.isLoggedIn()) {
            this.redirectToHostedUI(getUrl);
        }
    }

    redirectToLogin() {
        this.redirectToHostedUI(state => this.getCognitoLoginUrl(state));
    }

    redirectToSignup() {
        this.redirectToHostedUI(state => this.getCognitoSignUpUrl(state));
    }

    redirectToHostedUI(getUrl) {
        const state = crypto.randomBytes(64).toString('hex');
        this.setCsrfState(state);
        let authUrl = getUrl(state);
        window.open(authUrl, '_self');
    }

    getCognitoLoginUrl(state) {
        return this.getCognitoUrl('login', state);
    }

    getCognitoSignUpUrl(state) {
        return this.getCognitoUrl('signup', state);
    }

    getCognitoUrl(path, state) {
        const scope = this.getTokenScopesQueryParam();
        let url = `https://${Config.Cognito.AppWebDomain}/${path}?response_type=token&client_id=${Config.Cognito.ClientAppId}&redirect_uri=${Config.Cognito.RedirectUriSignIn}&scope=${scope}`;
        if (state) {
            url += '&state=' + state;
        }
        return url;
    }

    getStorageKey(keyName) {
        return `${Constants.FoodMarketStorageKeyRoot}.${Config.Cognito.ClientAppId}.${keyName}`;
    }

    setLastPath(pathname) {
        let key = this.getStorageKey('last-path')
        window.sessionStorage.setItem(key, pathname);
    }

    getLastPath() {
        let key = this.getStorageKey('last-path')
        return window.sessionStorage.getItem(key);
    }

    setCsrfState(state) {
        let key = this.getStorageKey('cognito-csrf-state')
        window.sessionStorage.setItem(key, state);
    }

    getCsrfState() {
        let key = this.getStorageKey('cognito-csrf-state')
        return window.sessionStorage.getItem(key);
    }

    verifyPhoneVerificationCode(code) {
        return new Promise((resolve, reject) => {
            const cognitoUser = this.getCognitoUser();
            cognitoUser.getSession((err, session) => {
                if (err) {
                    reject(err);
                    return;
                }

                cognitoUser.verifyAttribute('phone_number', code,
                    {
                        onSuccess: (success) => {
                            resolve(success);
                        },
                        onFailure: (error) => {
                            reject(error);
                        }
                    });
            });
        });
    }

    sendPhoneVerificationCode(phone) {

        if (!this.isLoggedIn()) {
            this.redirectToLogin();
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            const cognitoUser = this.getCognitoUser();
            cognitoUser.getSession((err, session) => {
                if (err) {
                    reject(err);
                    return;
                }

                phone = phone.replace(/ /g, '');
                const attributes = [
                    new CognitoUserAttribute({
                        Name: 'phone_number',
                        Value: phone
                    })
                ];
                cognitoUser.updateAttributes(attributes, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    cognitoUser.getAttributeVerificationCode('phone_number',
                        {
                            onSuccess: () => {
                            },
                            onFailure: (error) => {
                                reject(error);
                            },
                            inputVerificationCode: (data) => {
                                resolve(data);
                            }
                        });
                });
            })
        });
    }
}
export default new CognitoUtil();