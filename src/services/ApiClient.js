import apigClientFactory from 'aws-api-gateway-client'
import moment from 'moment'
import CognitoUtil from './Cognito/CognitoUtil'
import Config from '../Config'
import { OrderStatus, DeliveryOptions } from '../Enums'
import FeatureToggles from '../FeatureToggles'

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

    createFoodOrder(jwt, order) {
        return this.invokeApi('/orders', 'POST', order);
    }

    confirmFoodOrder(jwt, order_id) {
        return this.invokeApi(`/orders/${order_id}/confirm`, 'POST');
    }

    updateUser(jwt, user) {
        return this.invokeApi('/users', 'PUT', user);
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

    loadUserProfile(userId) {
        return this.invokeApi(`/users/${userId}/private`, 'GET');
    }

    saveUserProfile(user) {
        return this.invokeApi(`/users/${user.user_id}/private`, 'PATCH', user);
    }

    connectStripeAccount(code) {
        const userId = CognitoUtil.getLoggedInUserId();
        if (!userId) {
            throw new Error('No user is currently logged in');
        }
        return this.invokeApi(`/users/${userId}/connectstripe`, 'POST', { code });
    }

    geoSearchFoods(geo) {
        const requestUrl = `/foods/geo?ne_lat=${geo.ne_lat}&ne_lng=${geo.ne_lng}&sw_lat=${geo.sw_lat}&sw_lng=${geo.sw_lng}`;
        return this.invokeApi(requestUrl, 'GET');
    }

    deliverySearchFoods(region) {
        const requestUrl = `/foods/deliveryByRegion?region_id=${region}`;
        return this.invokeApi(requestUrl, 'GET');
    }

    getOrdersByBuyerId(buyer_user_id) {
        if (FeatureToggles.UseOrderBackend) {
            return this.invokeApi(`/orders?buyer_user_id=${buyer_user_id}`, 'GET');
        }

        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve({ data: buyerOrders });
            }, 1000);
        })
    }

    getOrdersByCookId(cook_user_id) {
        if (FeatureToggles.UseOrderBackend) {
            return this.invokeApi(`/orders?cook_user_id=${cook_user_id}`, 'GET');
        }

        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve({ data: buyerOrders });
            }, 1000);
        });
    }

    acceptOrder(order, reason) {
        if (FeatureToggles.UseOrderBackend) {
            return this.invokeApi(`/orders/${order.order_id}/accept`, 'POST', { reason });
        }

        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve();
            }, 1000);
        })
    }

    declineOrder(order, reason) {
        if (FeatureToggles.UseOrderBackend) {
            return this.invokeApi(`/orders/${order.order_id}/decline`, 'POST', { reason });
        }

        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve();
            }, 1000);
        })
    }

    cancelOrder(order, reason) {
        if (FeatureToggles.UseOrderBackend) {
            return this.invokeApi(`/orders/${order.order_id}/cancel`, 'POST', { reason });
        }

        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve();
            }, 1000);
        })
    }
}

const buyerOrders = [{
    order_id: 'XSJFSQOEO',
    food_id: '80257a30-07cd-11e8-93ae-7d25d44321f0',
    delivery_option: DeliveryOptions.pickup,
    date: moment('2018-03-20'),
    time: '10 AM - 11 AM',
    quantity: 3,
    status: OrderStatus.Pending,
    address: '1265 Burnaby Street, Vancouver, BC',
    food: {
        title: 'Pork + Chive Dumplings',
        imageUrls: ['/assets/images/Johanndumplings.jpg'],
        price: 8,
        unit: '20 dumplings',
    },
    cook: {
        name: 'Johann',
        image: '/assets/images/users/johannk.jpg',
        email: 'johann@kao.com'
    },
    buyer: {
        name: 'Elliot',
        image: '/assets/images/users/elliot.jpg',
        email: 'elliot@work.com'

    }
},
{
    order_id: 'adsjhfklh23',
    food_id: '80283950-07cd-11e8-a3a6-cd45bd5ea586',
    delivery_option: DeliveryOptions.delivery,
    date: moment('2018-03-20'),
    time: '10 AM - 11 AM',
    quantity: 3,
    status: OrderStatus.Pending,
    address: '1265 Burnaby Street, Vancouver, BC',
    food: {
        title: 'Smoked Beer Can Chicken',
        imageUrls: ['/assets/images/GabeC_SmokedChicken_BeerCan_600x410.jpg'],
        price: 25,
        unit: '1 whole chicken',
    },
    cook: {
        name: 'Steve',
        image: '/assets/images/users/steve.jpg',
        email: 'steve@work.com'
    },
    buyer: {
        name: 'Jenny',
        image: '/assets/images/users/jenny.jpg',
        email: 'jenny@work.com'

    }
},
{
    order_id: '2k3l4jlk289sf',
    food_id: '802b1f80-07cd-11e8-8562-b5cca42ec0d7',
    delivery_option: DeliveryOptions.pickup,
    date: moment('2018-03-20'),
    time: '10 AM - 11 AM',
    quantity: 22,
    status: OrderStatus.Pending,
    address: '1265 Burnaby Street, Vancouver, BC',
    food: {
        title: 'Casserole',
        imageUrls: ['/assets/images/HollyC_baconcasserole.jpg'],
        price: 15,
        unit: '9X13 casserole dish',
    },
    cook: {
        name: 'Molly',
        image: '/assets/images/users/molly.png',
        email: 'molly@work.com'
    },
    buyer: {
        name: 'Matthew',
        image: '/assets/images/users/matthew.png',
        email: 'matthew@work.com'

    }
},
{
    order_id: 'AABXOSKSJK2',
    food_id: '802b1f80-07cd-11e8-8562-b5cca42ec0d7',
    delivery_option: DeliveryOptions.pickup,
    date: moment('2018-03-15'),
    time: '10 AM - 11 AM',
    quantity: 1,
    status: OrderStatus.Accepted,
    address: '459 Ailsa Avenue, Port Moody, BC',
    food: {
        title: 'Casserole',
        imageUrls: ['/assets/images/HollyC_baconcasserole.jpg'],
        price: 15,
        unit: '9X13 casserole dish',
    },
    cook: {
        name: 'Molly',
        image: '/assets/images/users/molly.png',
        email: 'molly@work.com'
    },
    buyer: {
        name: 'Matthew',
        image: '/assets/images/users/matthew.png',
        email: 'matthew@work.com'

    }
},
{
    order_id: 'LKJWEN4KLOJ',
    food_id: '80283950-07cd-11e8-a3a6-cd45bd5ea586',
    delivery_option: DeliveryOptions.delivery,
    date: moment('2018-04-20'),
    time: '10 AM - 11 AM',
    quantity: 5,
    status: OrderStatus.Declined,
    address: '123 Davie St., Vancouver, BC',
    food: {
        title: 'Smoked Beer Can Chicken',
        imageUrls: ['/assets/images/GabeC_SmokedChicken_BeerCan_600x410.jpg'],
        price: 25,
        unit: '1 whole chicken',
    },
    cook: {
        name: 'Steve',
        image: '/assets/images/users/steve.jpg',
        email: 'steve@work.com'
    },
    buyer: {
        name: 'Jenny',
        image: '/assets/images/users/jenny.jpg',
        email: 'jenny@work.com'

    }
}
]

export default new ApiClient();