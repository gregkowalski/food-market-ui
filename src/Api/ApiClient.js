import apigClientFactory from 'aws-api-gateway-client'
import CognitoUtil from '../Cognito/CognitoUtil'
import Config from '../Config'

export default class ApiClient {

    apiGatewayClient;

    constructor() {
        var config = {
            region: Config.Api.Region,
            invokeUrl: Config.Api.BaseUrl,
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
        const userId = CognitoUtil.getLoggedInUserId();
        if (!userId) {
            throw new Error('No user is currently logged in');
        }
        return this.apiGatewayClient.invokeApi(null, `/users/${userId}`, 'GET',
            { headers: this.jsonHttpHeader() });
    }

    getUser(userId) {
        return this.apiGatewayClient.invokeApi(null, `/users/${userId}`, 'GET',
            { headers: this.jsonHttpHeader() });
    }

    getPublicUser(userId) {
        return this.apiGatewayClient.invokeApi(null, `/users/${userId}/public`, 'GET');
    }

    loadUserProfile(userId) {
        return this.apiGatewayClient.invokeApi(null, `/users/${userId}/private`, 'GET', { headers: this.jsonHttpHeader() });
    }

    saveUserProfile(user) {
        return this.apiGatewayClient.invokeApi(null, `/users/${user.user_id}/private`, 'PATCH', { headers: this.jsonHttpHeader() }, user);
    }

    connectStripeAccount(code) {
        const userId = CognitoUtil.getLoggedInUserId();
        if (!userId) {
            throw new Error('No user is currently logged in');
        }
        return this.apiGatewayClient.invokeApi(null, `/users/${userId}/connectstripe`, 'POST',
            { headers: this.jsonHttpHeader() }, { code });
    }
}