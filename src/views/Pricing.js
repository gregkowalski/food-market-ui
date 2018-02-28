import React from 'react'
import { Input, Grid } from 'semantic-ui-react'
import AppHeader from '../components/AppHeader'
import Constants from '../Constants'

export default class Pricing extends React.Component {

    state = {
        quantity: 1,
        cook_price: 10,
        model2: {}
    };

    stripePercentageFee = 0.029;
    stripeTransactionFee = 0.3;

    componentWillMount() {
        let buyer_price = this.getBuyerPrice(this.state.cook_price);
        this.setState({ buyer_price: buyer_price });
        this.updateNet(this.state.cook_price, buyer_price, this.state.quantity);
    }

    getOrderPayment(cookPrice, buyerPrice, quantity) {

        const total = buyerPrice * quantity;

        // Based on stripe pricing of 2.9% + $0.30 per transaction
        const stripeFee = total * this.stripePercentageFee + this.stripeTransactionFee;

        let cookBase = cookPrice * quantity;
        let foodcraftBase = (buyerPrice - cookPrice) * quantity;

        // cooks and foodcraft pay the portion of the stripe fee
        // relative to their earnings in the transaction
        const cookStripeFee = (cookBase / total) * stripeFee;
        const foodcraftStripeFee = (foodcraftBase / total) * stripeFee;

        const cookNet = cookBase - cookStripeFee;
        const foodcraftNet = foodcraftBase - foodcraftStripeFee;

        const payment = {
            totalAmount: total.toFixed(2),
            cookStripeFee: cookStripeFee.toFixed(2),
            cookAmount: cookNet.toFixed(2),
            foodcraftAmount: foodcraftNet.toFixed(2),
            foodcraftStripeFee: foodcraftStripeFee.toFixed(2)
        };
        return payment;
    }

    getModelTwoPayment(cookPrice, buyerPrice, quantity) {

        const total = buyerPrice * quantity;
        const stripeFee = total * this.stripePercentageFee + this.stripeTransactionFee;
        const netPay = total - stripeFee;
        const foodcraftFee = netPay * Constants.ServiceFeeRate;
        const cookPay = netPay - foodcraftFee;

        const payment = {
            totalAmount: total.toFixed(2),
            stripeFee: stripeFee.toFixed(2),
            netPay: netPay.toFixed(2),
            fcFee: foodcraftFee.toFixed(2),
            cookAmount: cookPay.toFixed(2),
        };
        return payment;
    }

    getCookPrice(buyerPrice) {
        let cookPrice = parseFloat(buyerPrice) / (1 + Constants.ServiceFeeRate);
        return cookPrice.toFixed(2);
    }

    getBuyerPrice(cookPrice) {
        let buyerPrice = parseFloat(cookPrice) * (1 + Constants.ServiceFeeRate);
        return buyerPrice.toFixed(2);
    }

    updateNet(cook_price, buyer_price, quantity) {
        let payment = this.getOrderPayment(parseFloat(cook_price, 10), parseFloat(buyer_price, 10), parseInt(quantity, 10));
        let model2 = this.getModelTwoPayment(parseFloat(cook_price, 10), parseFloat(buyer_price, 10), parseInt(quantity, 10));
        this.setState({
            fc_net: payment.foodcraftAmount,
            fc_fee: payment.foodcraftStripeFee,
            cook_net: payment.cookAmount,
            cook_fee: payment.cookStripeFee,
            model2: model2
        });
    }

    handleQuantityChange = (e) => {
        if (!e.target.value) {
            this.setState({ quantity: e.target.value });
            return;
        }

        let quantity = parseInt(e.target.value, 10);
        if (!quantity)
            return;

        this.setState({ quantity: quantity });
        this.updateNet(this.state.cook_price, this.state.buyer_price, quantity);
    }

    handleCookPriceChange = (e) => {
        if (!e.target.value) {
            this.setState({ cook_price: e.target.value });
            return;
        }

        let cook_price = parseFloat(e.target.value, 10);
        if (!cook_price)
            return;

        let buyer_price = this.getBuyerPrice(cook_price);
        this.setState({ cook_price: cook_price, buyer_price: buyer_price });
        this.updateNet(cook_price, buyer_price, this.state.quantity);
    }

    handleBuyerPriceChange = (e) => {
        if (!e.target.value) {
            this.setState({ buyer_price: e.target.value });
            return;
        }

        let buyer_price = parseFloat(e.target.value);
        if (!buyer_price) {
            return;
        }

        let cook_price = this.getCookPrice(buyer_price, this.state.quantity);
        this.setState({ cook_price: cook_price, buyer_price: buyer_price });
        this.updateNet(cook_price, buyer_price, this.state.quantity);
    }

    getPercent(value) {
        return (100 * value / this.state.quantity / this.state.buyer_price).toFixed(1);
    }

    render() {
        return (
            <div>
                <AppHeader />
                <div style={{ margin: '30px 50px' }}>
                    <div>Stripe fee: 2.9% + $0.30</div>
                    <div>Service fee: 12%</div>
                    <Grid stackable style={{ marginTop: '20px' }}>
                        <Grid.Row>
                            <Grid.Column>Quantity:</Grid.Column>
                            <Grid.Column>
                                <Input name='quantity' onChange={this.handleQuantityChange} value={this.state.quantity} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>Cook Price:</Grid.Column>
                            <Grid.Column>
                                <Input name='cook_price' onChange={this.handleCookPriceChange} value={this.state.cook_price} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>Buyer Price:</Grid.Column>
                            <Grid.Column>
                                <Input name='buyer_price' onChange={this.handleBuyerPriceChange} value={this.state.buyer_price} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>Stripe Fee</Grid.Column>
                            <Grid.Column>Foodcraft Net</Grid.Column>
                            <Grid.Column>Cook Net</Grid.Column>
                            <Grid.Column>Foodcraft Stripe Fee</Grid.Column>
                            <Grid.Column>Cook Stripe Fee</Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>${(parseFloat(this.state.fc_fee) + parseFloat(this.state.cook_fee)).toFixed(2)}</Grid.Column>
                            <Grid.Column>${this.state.fc_net}</Grid.Column>
                            <Grid.Column>${this.state.cook_net}</Grid.Column>
                            <Grid.Column>${this.state.fc_fee}</Grid.Column>
                            <Grid.Column>${this.state.cook_fee}</Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>{this.getPercent(parseFloat(this.state.fc_fee) + parseFloat(this.state.cook_fee))}%</Grid.Column>
                            <Grid.Column>{this.getPercent(this.state.fc_net)}%</Grid.Column>
                            <Grid.Column>{this.getPercent(this.state.cook_net)}%</Grid.Column>
                            <Grid.Column>{this.getPercent(this.state.fc_fee)}%</Grid.Column>
                            <Grid.Column>{this.getPercent(this.state.cook_fee)}%</Grid.Column>
                        </Grid.Row>


                        <Grid.Row>
                            <Grid.Column>Stripe Fee</Grid.Column>
                            <Grid.Column>Foodcraft Fee</Grid.Column>
                            <Grid.Column>Cook Net</Grid.Column>
                            <Grid.Column>Net Pay</Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>${this.state.model2.stripeFee}</Grid.Column>
                            <Grid.Column>${this.state.model2.fcFee}</Grid.Column>
                            <Grid.Column>${this.state.model2.cookAmount}</Grid.Column>
                            <Grid.Column>${this.state.model2.netPay}</Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>{this.getPercent(this.state.model2.stripeFee)}%</Grid.Column>
                            <Grid.Column>{this.getPercent(this.state.model2.fcFee)}%</Grid.Column>
                            <Grid.Column>{this.getPercent(this.state.model2.cookAmount)}%</Grid.Column>
                            <Grid.Column>{this.getPercent(this.state.model2.netPay)}%</Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div >
            </div >
        )
    }
}
