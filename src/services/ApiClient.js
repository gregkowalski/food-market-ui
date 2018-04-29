import apigClientFactory from 'aws-api-gateway-client'
import CognitoUtil from './Cognito/CognitoUtil'
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

    invokeApi(pathTemplate, method, body) {
        return this.apiGatewayClient.invokeApi(null, pathTemplate, method,
            { headers: this.jsonHttpHeader() }, body);
    }

    getCurrentUser() {
        const userId = CognitoUtil.getLoggedInUserId();
        if (!userId) {
            throw new Error('No user is currently logged in');
        }
        return this.getUser(userId);
    }

    getUser(userId) {
        return this.invokeApi(`/users/${userId}`, 'GET');
    }

    getPublicUser(userId) {
        return this.invokeApi(`/users/${userId}/public`, 'GET');
    }

    loadUserProfile(userId) {
        return this.invokeApi(`/users/${userId}/private`, 'GET');
    }

    saveUserProfile(user) {
        return this.invokeApi(`/users/${user.user_id}/private`, 'PATCH', user);
    }

    updateUser(jwt, user) {
        return this.invokeApi('/users', 'PUT', user);
    }

    connectStripeAccount(code) {
        const userId = CognitoUtil.getLoggedInUserId();
        if (!userId) {
            throw new Error('No user is currently logged in');
        }
        return this.invokeApi(`/users/${userId}/connectstripe`, 'POST', { code });
    }



    getFoods() {
        return this.invokeApi(`/foods`, 'GET');
    }

    getFood(foodId) {
        return this.invokeApi(`/foods/${foodId}`, 'GET');
    }

    getReviews() {
        return this.invokeApi(`/reviews`, 'GET');
    }

    getReview(reviewId) {
        return this.invokeApi(`/foods/${reviewId}`, 'GET');
    }

    geoSearchFoods(geo, date) {
        var dateQueryParam = date ? `&date=${date}` : '';
        const requestUrl = `/foods/geo?ne_lat=${geo.ne_lat}&ne_lng=${geo.ne_lng}&sw_lat=${geo.sw_lat}&sw_lng=${geo.sw_lng}${dateQueryParam}`;
        return this.invokeApi(requestUrl, 'GET');
    }

    deliverySearchFoods(region_id, date) {
        var dateQueryParam = date ? `&date=${date}` : '';
        return this.invokeApi(`/foods/deliveryByRegion?region_id=${region_id}${dateQueryParam}`, 'GET');
    }

    createFoodOrder(jwt, order) {
        return this.invokeApi('/orders', 'POST', order);
    }

    getOrdersByBuyerId(buyer_user_id) {
        return this.invokeApi(`/orders?buyer_user_id=${buyer_user_id}`, 'GET');
    }

    getOrdersByCookId(cook_user_id) {
        return this.invokeApi(`/orders?cook_user_id=${cook_user_id}`, 'GET');
    }

    acceptOrder(order, reason) {
        return this.invokeApi(`/orders/${order.order_id}/accept`, 'POST', { reason });
    }

    declineOrder(order, reason) {
        return this.invokeApi(`/orders/${order.order_id}/decline`, 'POST', { reason });
    }

    cancelOrder(order, reason) {
        return this.invokeApi(`/orders/${order.order_id}/cancel`, 'POST', { reason });
    }
}

export default new ApiClient();