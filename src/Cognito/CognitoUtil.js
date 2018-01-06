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

    static redirectToLoginIfNoSession() {
        this.redirectIfNoSession(state => CognitoUtil.getCognitoLoginUrl(state));
    }

    static redirectToSignupIfNoSession() {
        this.redirectIfNoSession(state => CognitoUtil.getCognitoSignUpUrl(state));
    }

    static redirectIfNoSession(getUrl) {
        let auth = new CognitoAuth(CognitoUtil.getCognitoAuthData());
        let session = auth.getCachedSession();
        if (!session || !session.isValid()) {
            const state = crypto.randomBytes(64).toString('hex');
            CognitoUtil.setCsrfState(state);
            let authUrl = getUrl(state);
            window.open(authUrl, '_self');
        }
    }

    static getUserPoolData() {
        return {
            UserPoolId: CognitoUtil.CognitoUserPoolId,
            ClientId: CognitoUtil.CognitoClientAppId
        };
    }

    static getCognitoLoginUrl(state) {
        return CognitoUtil.getCognitoUrl('login', state);
    }

    static getCognitoSignUpUrl(state) {
        return CognitoUtil.getCognitoUrl('signup', state);
    }

    static getCognitoUrl(path, state) {
        let url = `${CognitoUtil.CognitoDomain}/${path}?response_type=token&client_id=${CognitoUtil.CognitoClientAppId}&redirect_uri=${CognitoUtil.RedirectUriSignIn}&scope=openid+profile+aws.cognito.signin.user.admin+email`;
        if (state) {
            url += '&state=' + state;
        }
        return url;
    }

    static getStorageKey(keyName) {
        return `${Constants.FoodMarketStorageKeyRoot}.${CognitoUtil.CognitoClientAppId}.${keyName}`;
    }

    static setLastPathname(pathname) {
        let key = CognitoUtil.getStorageKey('lastPathname')
        window.sessionStorage.setItem(key, pathname);
    }

    static getLastPathname() {
        let key = CognitoUtil.getStorageKey('lastPathname')
        return window.sessionStorage.getItem(key);
    }

    static setCsrfState(state) {
        let key = CognitoUtil.getStorageKey('cognito-csrf-state')
        window.sessionStorage.setItem(key, state);
    }

    static getCsrfState() {
        let key = CognitoUtil.getStorageKey('cognito-csrf-state')
        return window.sessionStorage.getItem(key);
    }
}
