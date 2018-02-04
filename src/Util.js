import queryString from 'query-string'
import { FoodPrepType } from './data/FoodItems'

export default class {

    static getFoodPrepTypeIcon(food) {
        let foodPrepIcon = 'shopping basket';
        if (food.states[0] === FoodPrepType.frozen) {
            foodPrepIcon = 'snowflake outline';
        }
        else if (food.states[0] === FoodPrepType.ready) {
            foodPrepIcon = 'checkmark box';
        }
        return foodPrepIcon;
    }

    static parseQueryString(location) {
        let query = location.search
        if (!query) {
            query = location.hash;
        }
        if (query && (query[0] === '#' || query[0] === '?')) {
            query = query.substring(1);
        }
        return queryString.parse(query);
    }

    static triggerEvent(target, type) {
        const doc = window.document;
        if (doc.createEvent) {
            const event = doc.createEvent('HTMLEvents');
            event.initEvent(type, true, true);
            target.dispatchEvent(event);
        } else {
            const event = doc.createEventObject();
            target.fireEvent(`on${type}`, event);
        }
    }

    static busySleep(seconds) {
        var e = new Date().getTime() + (seconds * 1000);
        while (new Date().getTime() <= e) { }
    }

    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static getRandomSign() {
        if (Math.random() > 0.5) {
            return 1;
        }
        return -1;
    }
}