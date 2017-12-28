export default class CognitoUtil {

  static storageKeyRoot = 'food-market';

  static CognitoDomain = 'https://local-cosmo-test.auth.us-west-2.amazoncognito.com';
  static CognitoClientAppId = 'dqkgel75ifc13rtlih1hooril';
  static CognitoCallbackUri = 'http://localhost:3000/cognitoCallback';
  static CognitoUserPoolId = 'us-west-2_mprqsYkPx';

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
    const loginUrl = `${CognitoUtil.CognitoDomain}/login?response_type=token&client_id=${CognitoUtil.CognitoClientAppId}&redirect_uri=${CognitoUtil.CognitoCallbackUri}&scope=openid+profile+aws.cognito.signin.user.admin+email`;
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
