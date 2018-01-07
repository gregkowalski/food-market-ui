import { Constants } from '../Constants'
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth'
import crypto from 'crypto'

export default class CognitoUtil {

    static AppWebDomain = 'local-cosmo-test.auth.us-west-2.amazoncognito.com';
    static CognitoDomain = 'https://' + CognitoUtil.AppWebDomain;
    static CognitoClientAppId = 'dkra9rqkjer2aqg23lrbp23hv';
    static RedirectUriSignIn = 'http://localhost:3000/cognitoCallback';
    static RedirectUriSignOut = 'http://localhost:3000/cognitoSignout';
    static CognitoUserPoolId = 'us-west-2_TvRu5yb9m';

    static getCognitoAuthData() {
        var authData = {
            ClientId: CognitoUtil.CognitoClientAppId,
            AppWebDomain: CognitoUtil.AppWebDomain,
            TokenScopesArray: ['openid', 'profile', 'aws.cognito.signin.user.admin', 'email'],
            RedirectUriSignIn: CognitoUtil.RedirectUriSignIn,
            RedirectUriSignOut: CognitoUtil.RedirectUriSignOut,
            UserPoolId: CognitoUtil.CognitoUserPoolId,
            // IdentityProvider : '<TODO: your identity provider you want to specify here>',
            // AdvancedSecurityDataCollectionFlag : <TODO: boolean value indicating whether you want to enable advanced security data collection>
        };
        return authData;
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
            UserPoolId: CognitoUtil.CognitoUserPoolId,
            ClientId: CognitoUtil.CognitoClientAppId
        };
    }

    static getCognitoLoginUrl(state) {
        return this.getCognitoUrl('login', state);
    }

    static getCognitoSignUpUrl(state) {
        return this.getCognitoUrl('signup', state);
    }

    static getCognitoUrl(path, state) {
        let url = `${this.CognitoDomain}/${path}?response_type=token&client_id=${this.CognitoClientAppId}&redirect_uri=${this.RedirectUriSignIn}&scope=openid+profile+aws.cognito.signin.user.admin+email`;
        if (state) {
            url += '&state=' + state;
        }
        return url;
    }

    static getStorageKey(keyName) {
        return `${Constants.FoodMarketStorageKeyRoot}.${CognitoUtil.CognitoClientAppId}.${keyName}`;
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
