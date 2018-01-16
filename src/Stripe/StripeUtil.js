import { Constants } from 'Constants'
import Config from 'Config'

export default class StripeUtil {

  static getStripeConnectUrl(state) {
    let url = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${Config.Stripe.ClientId}&scope=read_write`;
    if (state) {
      url += '&state=' + state;
    }
    return url;
  }

  static getStorageKey(keyName) {
    return `${Constants.FoodMarketStorageKeyRoot}.${Config.Stripe.ClientId}.${keyName}`;
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
