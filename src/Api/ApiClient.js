import apigClientFactory from 'aws-api-gateway-client'

export default class ApiClient {

    apiGatewayClient;

    constructor() {
        var config = {
            region: 'us-west-2',
            invokeUrl: 'https://local-api.cosmo-test.com/v1',
        };
        this.apiGatewayClient = apigClientFactory.newClient(config);
    }

    submitFoodOrder(jwtToken, stripeToken, order) {
        let body = {
            stripeTokenId: stripeToken.id,
            order: order
        }

        var additionalParams = {
            headers: {
                'Authorization': jwtToken,
                'Content-Type': 'application/json'
            },
        };

        return this.apiGatewayClient.invokeApi(null, '/charges', 'POST', additionalParams, body);
    }
}