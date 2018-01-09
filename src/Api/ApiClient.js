import apigClientFactory from 'aws-api-gateway-client'
import CognitoUtil from '../Cognito/CognitoUtil'
import jwtDecode from 'jwt-decode'

export default class ApiClient {

    apiGatewayClient;

    constructor() {
        var config = {
            region: 'us-west-2',
            invokeUrl: 'https://api-dev.cosmo-test.com/v1',
        };
        this.apiGatewayClient = apigClientFactory.newClient(config);
    }

    jsonHttpHeader(jwt) {
        if (!jwt) {
            jwt = CognitoUtil.getLoggedInUserJwtToken();
        }
        let headers = {
            'Content-Type': 'application/json'
        };
        if (jwt) {
            headers.Authorization = jwt;
        }
        return headers;
    }

    connectStripeAccount(jwt, code) {
        return this.apiGatewayClient.invokeApi(null, '/connectstripe', 'POST',
            { headers: this.jsonHttpHeader(jwt) }, { code });
    }

    submitFoodOrder(jwt, stripeToken, order) {
        let body = {
            stripeTokenId: stripeToken.id,
            order: order
        }
        return this.apiGatewayClient.invokeApi(null, '/charges', 'POST',
            { headers: this.jsonHttpHeader(jwt) }, body);
    }

    updateUser(jwt, user) {
        return this.apiGatewayClient.invokeApi(null, '/users', 'PUT',
            { headers: this.jsonHttpHeader(jwt) }, user);
    }

    linkUser(jwt, user) {
        return this.apiGatewayClient.invokeApi(null, '/users', 'PATCH',
            { headers: this.jsonHttpHeader(jwt) }, user);
    }

    getUserByJsUserId(jsUserId) {
        return this.apiGatewayClient.invokeApi(null, `/users?js_user_id=${jsUserId}`, 'GET',
            { headers: this.jsonHttpHeader() });
    }

    getCurrentUser() {
        const jwtToken = CognitoUtil.getLoggedInUserJwtToken();
        const jwt = jwtDecode(jwtToken);
        const userId = jwt.sub;
        return this.apiGatewayClient.invokeApi(null, `/users/${userId}`, 'GET',
            { headers: this.jsonHttpHeader(jwtToken) });
    }

    getUser(userId) {
        return this.apiGatewayClient.invokeApi(null, `/users/${userId}`, 'GET',
            { headers: this.jsonHttpHeader() });
    }
}