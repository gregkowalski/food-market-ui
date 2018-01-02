import { FoodPrepType } from './data/FoodItems'
import queryString from 'query-string'

export default class {
  static getFoodPrepTypeIcon(food) {
    let foodPrepIcon = 'shopping basket';
    if (food.prep === FoodPrepType.frozen) {
      foodPrepIcon = 'snowflake outline';
    }
    else if (food.prep === FoodPrepType.ready) {
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
}