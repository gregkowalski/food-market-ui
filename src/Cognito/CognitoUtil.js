import { Constants } from '../Constants'
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth'
import crypto from 'crypto'
import jwtDecode from 'jwt-decode'
import Config from '../Config'

export default class CognitoUtil {

    static getCognitoAuthData() {
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

    static getTokenScopesQueryParam() {
        return this.getCognitoAuthData().TokenScopesArray.join('+');
    }

    static getLoggedInUserJwtToken() {
        let auth = new CognitoAuth(this.getCognitoAuthData());
        let session = auth.getCachedSession();
        if (session && session.isValid()) {
            return session.getIdToken().getJwtToken();
        }
        return null;
    }

    static isExternalIdp(jwt) {
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

    static isEmailVerified(jwt) {
        if (jwt.email_verified) {
            return true;
        }
        return this.isExternalIdp(jwt);
    }

    static getLoggedInUserJwt() {
        const jwtToken = this.getLoggedInUserJwtToken();
        if (jwtToken) {
            return jwtDecode(jwtToken);
        }
        return null;
    }

    static isLoggedIn() {
        let auth = new CognitoAuth(this.getCognitoAuthData());
        let session = auth.getCachedSession();
        return (session && session.isValid());
    }

    static redirectToLoginIfNoSession() {
        this.redirectIfNoSession(state => this.getCognitoLoginUrl(state));
    }

    static redirectToSignupIfNoSession() {
        this.redirectIfNoSession(state => this.getCognitoSignUpUrl(state));
    }

    static redirectIfNoSession(getUrl) {
        if (!this.isLoggedIn()) {
            this.redirectToHostedUI(getUrl);
        }
    }

    static redirectToLogin() {
        this.redirectToHostedUI(state => this.getCognitoLoginUrl(state));
    }

    static redirectToSignup() {
        this.redirectToHostedUI(state => this.getCognitoSignUpUrl(state));
    }

    static redirectToHostedUI(getUrl) {
        const state = crypto.randomBytes(64).toString('hex');
        this.setCsrfState(state);
        let authUrl = getUrl(state);
        window.open(authUrl, '_self');
    }

    static getUserPoolData() {
        return {
            UserPoolId: Config.Cognito.UserPoolId,
            ClientId: Config.Cognito.ClientAppId
        };
    }

    static getCognitoLoginUrl(state) {
        return this.getCognitoUrl('login', state);
    }

    static getCognitoSignUpUrl(state) {
        return this.getCognitoUrl('signup', state);
    }

    static getCognitoUrl(path, state) {
        const scope = this.getTokenScopesQueryParam();
        let url = `https://${Config.Cognito.AppWebDomain}/${path}?response_type=token&client_id=${Config.Cognito.ClientAppId}&redirect_uri=${Config.Cognito.RedirectUriSignIn}&scope=${scope}`;
        if (state) {
            url += '&state=' + state;
        }
        return url;
    }

    static getStorageKey(keyName) {
        return `${Constants.FoodMarketStorageKeyRoot}.${Config.Cognito.ClientAppId}.${keyName}`;
    }

    static setLastPathname(pathname) {
        let key = this.getStorageKey('lastPathname')
        window.sessionStorage.setItem(key, pathname);
    }

    static getLastPathname() {
        let key = this.getStorageKey('lastPathname')
        return window.sessionStorage.getItem(key);
    }

    static setCsrfState(state) {
        let key = this.getStorageKey('cognito-csrf-state')
        window.sessionStorage.setItem(key, state);
    }

    static getCsrfState() {
        let key = this.getStorageKey('cognito-csrf-state')
        return window.sessionStorage.getItem(key);
    }
}
