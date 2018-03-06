import Constants from '../Constants'

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
        let total = quantity * unitPrice;
        return parseInt(total.toFixed(0), 10);
    }

    getPrice(unitPrice, quantity) {
        if (!quantity) {
            quantity = 1;
        }

        return this.getTotal(unitPrice, quantity);
    }
}

export default new PriceCalc();