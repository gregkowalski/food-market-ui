import { FeatureToggles } from './FeatureToggles'
import { Constants } from './Constants'

const StripePercentageFee = 0.029;
const StripeTransactionFee = 30;

class PriceCalc {

    getOrderPayment(unitPrice, quantity) {

        // All calculations are done in cents
        const cookBase = 100 * quantity * unitPrice;
        const foodcraftBase = cookBase * Constants.ServiceFeeRate;
        const total = cookBase + foodcraftBase;

        // Based on stripe pricing of 2.9% + $0.30 per transaction
        const stripeFee = total * StripePercentageFee + StripeTransactionFee;

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

    getTotal(unitPrice, quantity) {
        let total = (quantity * unitPrice * (1 + Constants.ServiceFeeRate));
        return total.toFixed(0);
    }

    getBaseTotal(unitPrice, quantity) {
        let baseTotal = quantity * unitPrice;
        return baseTotal.toFixed(0);
    }

    getServiceFee(unitPrice, quantity) {
        let fee = quantity * unitPrice * Constants.ServiceFeeRate;
        return fee.toFixed(0);
    }

    getPrice(unitPrice, quantity) {
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

export default new PriceCalc();