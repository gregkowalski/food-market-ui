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

    getUsers(userIds) {
        return this.invokeApi(`/public/users?user_ids=${userIds.join(',')}`, 'GET');
    }

    getPublicUser(userId) {
        return this.invokeApi(`/public/users/${userId}`, 'GET');
    }

    loadUserProfile(userId) {
        return this.invokeApi(`/private/users/${userId}`, 'GET');
    }

    saveUserProfile(user) {
        return this.invokeApi(`/private/users/${user.user_id}`, 'PATCH', user);
    }

    updateUser(user) {
        return this.invokeApi('/users', 'PUT', user);
    }

    acceptTerms(userId) {
        return this.invokeApi(`/users/${userId}/acceptTerms`, 'POST');
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

    saveFood(food) {
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
        }
        return this.invokeApi(`/foods/${food.food_id}`, 'PUT', food_dto);
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