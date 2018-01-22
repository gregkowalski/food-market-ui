import { FeatureToggles } from './FeatureToggles'
import { Constants } from './Constants'

export default class PriceCalc {

    static stripePercentageFee = 0.029;
    static stripeTransactionFee = 30;

    static getOrderPayment(unitPrice, quantity) {

        // All calculations are done in cents
        const cookBase = 100 * quantity * unitPrice;
        const foodcraftBase = cookBase * Constants.ServiceFeeRate;
        const total = cookBase + foodcraftBase;

        // Based on stripe pricing of 2.9% + $0.30 per transaction
        const stripeFee = total * this.stripePercentageFee + this.stripeTransactionFee;

        // cooks and foodcraft pay the portion of the stripe fee
        // relative to their earnings in the transaction
        const cookStripeFee = (cookBase / total) * stripeFee;
        const foodcraftStripeFee = (foodcraftBase / total) * stripeFee;

        const cookTotal = cookBase - cookStripeFee;
        const foodcraftTotal = foodcraftBase - foodcraftStripeFee;

        const payment = {
            totalAmount: total,
            cookAmount: Math.round(cookTotal),
            foodcraftAmount: Math.round(foodcraftTotal)
        };
        return payment;
    }

    static getTotal(unitPrice, quantity) {
        let total = (quantity * unitPrice * (1 + Constants.ServiceFeeRate));
        return total.toFixed(0);
    }

    static getBaseTotal(unitPrice, quantity) {
        let baseTotal = quantity * unitPrice;
        return baseTotal.toFixed(0);
    }

    static getServiceFee(unitPrice, quantity) {
        let fee = quantity * unitPrice * Constants.ServiceFeeRate;
        return fee.toFixed(0);
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