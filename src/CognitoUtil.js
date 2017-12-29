export default class CognitoUtil {

  static storageKeyRoot = 'food-market';

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

  static getUserPoolData() {
    return {
      UserPoolId: CognitoUtil.CognitoUserPoolId,
      ClientId: CognitoUtil.CognitoClientAppId
    };
  }

  static getCognitoTokenUrl() {
    return `${CognitoUtil.CognitoDomain}/oauth2/token`;
  }

  static getCognitoLoginUrl() {
    const loginUrl = `${CognitoUtil.CognitoDomain}/login?response_type=token&client_id=${CognitoUtil.CognitoClientAppId}&redirect_uri=${CognitoUtil.RedirectUriSignIn}&scope=openid+profile+aws.cognito.signin.user.admin+email`;
    return loginUrl;
  }

  static getStorageKey(keyName) {
    return `${CognitoUtil.storageKeyRoot}.${CognitoUtil.CognitoClientAppId}.${keyName}`;
  }

  static setLastPathname(pathname) {
    let key = CognitoUtil.getStorageKey('lastPathname')
    window.sessionStorage.setItem(key, pathname);
  }

  static getLastPathname() {
    let key = CognitoUtil.getStorageKey('lastPathname')
    return window.sessionStorage.getItem(key);
  }

  static setCognitoAuth(cognitoAuth) {
    window.sessionStorage.setItem(CognitoUtil.getStorageKey("access_token"), cognitoAuth.access_token);
    window.sessionStorage.setItem(CognitoUtil.getStorageKey("token_type"), cognitoAuth.token_type);
    window.sessionStorage.setItem(CognitoUtil.getStorageKey("expires_in"), cognitoAuth.expires_in);
    window.sessionStorage.setItem(CognitoUtil.getStorageKey("id_token"), cognitoAuth.id_token);
  }

  static getCognitoAuth() {
    const access_token = window.sessionStorage.getItem(CognitoUtil.getStorageKey("access_token"));
    const id_token = window.sessionStorage.getItem(CognitoUtil.getStorageKey("id_token"));
    if (!access_token || !id_token) {
      return null;
    }
    return {
      access_token: access_token,
      id_token: id_token,
      token_type: window.sessionStorage.getItem(CognitoUtil.getStorageKey("token_type")),
      expires_in: window.sessionStorage.getItem(CognitoUtil.getStorageKey("expires_in"))
    }
  }
}
