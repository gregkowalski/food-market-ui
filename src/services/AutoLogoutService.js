import CognitoUtil from './Cognito/CognitoUtil';

const CheckIntervalMs = 10000 // in ms

class AutoLogoutService {

    init() {
        setInterval(() => {
            this.check();
        }, CheckIntervalMs);
    }

    initSession() {
        CognitoUtil.storeSessionExpiry();
    }

    check() {
        if (CognitoUtil.hasSessionExpiry()) {
            CognitoUtil.redirectToLoginIfNoSession();
        }
    }
}

export default new AutoLogoutService();