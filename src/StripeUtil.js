import { Constants } from './Constants'

export default class StripeUtil {

  static StripeClientId = 'ca_C2ECxvqWXaiTNmA44vVjfx2clgV7OexY';

  static getStripeConnectUrl(state) {
    let url = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${StripeUtil.StripeClientId}&scope=read_write`;
    if (state) {
      url += '&state=' + state;
    }
    return url;
  }

  static getStorageKey(keyName) {
    return `${Constants.FoodMarketStorageKeyRoot}.${StripeUtil.StripeClientId}.${keyName}`;
  }

  static setCsrfState(state) {
    let key = StripeUtil.getStorageKey('stripe-csrf-state')
    window.sessionStorage.setItem(key, state);
  }

  static getCsrfState() {
    let key = StripeUtil.getStorageKey('stripe-csrf-state')
    return window.sessionStorage.getItem(key);
  }
}
