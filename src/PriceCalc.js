import { FeatureToggles } from './FeatureToggles'
import { Constants } from './Constants'

export default class PriceCalc {
    
    static getTotal(unitPrice, quantity) {
        let total = (quantity * unitPrice * (1 + Constants.ServiceFeeRate));
        return total.toFixed(2);
    }

    static getBaseTotal(unitPrice, quantity) {
        let baseTotal = quantity * unitPrice;
        return baseTotal.toFixed(2);
    }

    static getServiceFee(unitPrice, quantity) {
        let fee = quantity * unitPrice * Constants.ServiceFeeRate;
        return fee.toFixed(2);
    }

    static getPrice(unitPrice, quantity) {
        if (!quantity) {
            quantity = 1;
        }

        if (FeatureToggles.AllinPrice) {
            return this.getTotal(unitPrice, quantity); 
        }
        else {
            return this.getBaseTotal(unitPrice, quantity);
        }
    }
}