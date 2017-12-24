import { FoodPrepType } from './data/FoodItems'

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
}