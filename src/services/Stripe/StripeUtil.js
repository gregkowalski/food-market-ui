import Constants from '../../Constants'
import Config from '../../Config'

class StripeUtil {

    getStripeConnectUrl(state) {
        let url = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${Config.Stripe.ClientId}&scope=read_write`;
        if (state) {
            url += '&state=' + state;
        }
        return url;
    }

    getStorageKey(keyName) {
        return `${Constants.FoodMarketStorageKeyRoot}.${Config.Stripe.ClientId}.${keyName}`;
    }

    setCsrfState(state) {
        let key = this.getStorageKey('stripe-csrf-state')
        window.sessionStorage.setItem(key, state);
    }

    getCsrfState() {
        let key = this.getStorageKey('stripe-csrf-state')
        return window.sessionStorage.getItem(key);
    }
}

export default new StripeUtil();