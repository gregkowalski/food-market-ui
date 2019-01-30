import CognitoUtil from './Cognito/CognitoUtil';

const CheckIntervalMs = 5000;

class AutoLogoutService {

    static intervalTimerId;

    init() {
        if (AutoLogoutService.intervalTimerId)
            return;

        AutoLogoutService.intervalTimerId = setInterval(this.check, CheckIntervalMs);
    }

    check = () => {
        CognitoUtil.redirectToLoginIfNoSession();
    }
}

export default new AutoLogoutService();