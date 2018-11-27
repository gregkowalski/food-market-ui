import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth'
import crypto from 'crypto'
import jwtDecode from 'jwt-decode'
import Config from '../../Config'
import { Constants } from '../../Constants'

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

    getTokenScopesQueryParam() {
        return this.getCognitoAuthData().TokenScopesArray.join('+');
    }

    getLoggedInUserId() {
        const jwt = this.getLoggedInUserJwt();
        if (!jwt) {
            return null;
        }
        return jwt.sub;
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

    getUserPoolData() {
        return {
            UserPoolId: Config.Cognito.UserPoolId,
            ClientId: Config.Cognito.ClientAppId
        };
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
}
export default new CognitoUtil();