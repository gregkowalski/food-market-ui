import apigClientFactory from 'aws-api-gateway-client'
import CognitoUtil from '../Cognito/CognitoUtil'
import Config from '../Config'

class ApiClient {

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

    submitFoodOrder(jwt, order) {
        return this.apiGatewayClient.invokeApi(null, '/orders', 'POST',
            { headers: this.jsonHttpHeader(jwt) }, order);
    }

    confirmFoodOrder(jwt, order_id) {
        return this.apiGatewayClient.invokeApi(null, `/orders/${order_id}/confirm`, 'POST',
            { headers: this.jsonHttpHeader(jwt) });
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

    getFoods() {
        return this.apiGatewayClient.invokeApi(null, `/foods`, 'GET');
    }

    getFood(foodId) {
        return this.apiGatewayClient.invokeApi(null, `/foods/${foodId}`, 'GET');
    }

    getReviews() {
        return this.apiGatewayClient.invokeApi(null, `/reviews`, 'GET');
    }

    getReview(reviewId) {
        return this.apiGatewayClient.invokeApi(null, `/foods/${reviewId}`, 'GET');
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

    geoSearchFoods(geo) {
        return this.apiGatewayClient.invokeApi(null, `/foods/geo?ne_lat=${geo.ne_lat}&ne_lng=${geo.ne_lng}&sw_lat=${geo.sw_lat}&sw_lng=${geo.sw_lng}`,
            'GET', { headers: this.jsonHttpHeader() });
    }
}

export default new ApiClient();