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
        if (!CognitoUtil.isLoggedIn()) {
            CognitoUtil.redirectToLogin();
            return Promise.reject();
        }

        return this.apiGatewayClient.invokeApi(null, pathTemplate, method,
            { headers: this.jsonHttpHeader() }, body);
    }

    getPublicUsers(userIds) {
        return this.invokeApi(`/public/users?user_ids=${userIds.join(',')}`, 'GET');
    }

    getPublicUser(userId) {
        return this.invokeApi(`/public/users/${userId}`, 'GET');
    }

    getUser() {
        return this.invokeApi(`/users/me`, 'GET');
    }

    saveUser(user) {
        return this.invokeApi(`/users/me`, 'PATCH', user);
    }

    acceptTerms() {
        return this.invokeApi(`/users/me/acceptTerms`, 'POST');
    }

    connectStripeAccount(code) {
        return this.invokeApi(`/users/me/connectstripe`, 'POST', { code });
    }

    confirmUser(client_id, username, confirmation_code) {
        const headers = { 'Content-Type': 'application/json' };
        const body = { client_id, username, confirmation_code };
        return this.apiGatewayClient.invokeApi(null, `/confirmUser`, 'POST', headers, body);
    }

    getFoods() {
        return this.invokeApi(`/foods`, 'GET');
    }

    getFood(foodId) {
        return this.invokeApi(`/foods/${foodId}`, 'GET');
    }

    deleteFood(food_id) {
        return this.invokeApi(`/foods/${food_id}`, 'DELETE');
    }

    saveFood(food) {
        const food_dto = this.toFoodDto(food);
        return this.invokeApi(`/foods/${food.food_id}`, 'PUT', food_dto);
    }

    createFood(food) {
        const food_dto = this.toFoodDto(food);
        return this.invokeApi(`/foods`, 'POST', food_dto);
    }

    toFoodDto(food) {
        const food_dto = {
            food_id: food.food_id,
            user_id: food.user_id,
            title: food.title,
            imageUrls: food.imageUrls,
            ingredients: food.ingredients,
            short_description: food.short_description,
            long_description: food.long_description,
            price: food.price,
            price_currency: food.price_currency,
            features: food.features,
            unit: food.unit,
            feed: food.feed,
            states: food.states,
            allergies: food.allergies,
            delivery: food.delivery,
            pickup: food.pickup,
            regions: food.regions,
            position: food.position,
            handoff_dates: food.handoff_dates,
            hidden: food.hidden,
        }
        return food_dto;
    }

    getReviews(food_id) {
        return this.invokeApi(`/reviews?food_id=${food_id}`, 'GET');
    }

    geoSearchFoods(geo, beginDate, endDate) {
        let requestUrl = `/foods/geo?ne_lat=${geo.ne_lat}&ne_lng=${geo.ne_lng}&sw_lat=${geo.sw_lat}&sw_lng=${geo.sw_lng}`;
        if (beginDate && endDate) {
            requestUrl += `&beginDate=${beginDate}&endDate=${endDate}`;
        }
        return this.invokeApi(requestUrl, 'GET');
    }

    deliverySearchFoods(region_id, beginDate, endDate) {
        let requestUrl = `/foods/deliveryByRegion?region_id=${region_id}`;
        if (beginDate && endDate) {
            requestUrl += `&beginDate=${beginDate}&endDate=${endDate}`;
        }
        return this.invokeApi(requestUrl, 'GET');
    }

    createFoodOrder(jwt, order) {
        return this.invokeApi('/orders', 'POST', order);
    }

    getOrdersByBuyerId() {
        return this.invokeApi(`/orders?buyer_user_id=me`, 'GET');
    }

    getOrdersByCookId() {
        return this.invokeApi(`/orders?cook_user_id=me`, 'GET');
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

    inviteUser(email) {
        return this.invokeApi(`/invites`, 'POST', { email });
    }

    acceptInvite(invite_id) {
        // don't want to include session info because the user is NOT logged in
        return this.apiGatewayClient.invokeApi(null, `/invites/${invite_id}/accept`, 'POST');
    }

    createSignedUrl(action, user_id, food_id, object_id) {
        return this.invokeApi(`/assets/presign`, 'POST', { action, user_id, food_id, object_id });
    }
}

export default new ApiClient();