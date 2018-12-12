import moment from 'moment'
import { DeliveryOptions } from "../Enums";

class ApiObjectMapper {

    mapOrders(orders) {
        if (!orders)
            return;

        orders.forEach(x => {
            return this.mapOrder(x);
        });

        return orders;
    }

    mapOrder(order) {
        order.pickup = order.delivery_option === DeliveryOptions.pickup;
        return order;
    }

    mapFood(food) {
        food.id = food.food_id;
        food.images = food.imageUrls;
        food.image = food.imageUrls[0];

        if (food.handoff_dates) {
            food.handoff_dates.sort((a, b) => {
                return moment.utc(a.start).diff(moment.utc(b.start));
            });
        }

        food.rating = 5;
        food.ratingCount = 3;

        return food;
    }

    mapFoods(foods) {
        if (!foods)
            return foods;

        foods.forEach(x => {
            return this.mapFood(x);
        });

        return foods;
    }
}

export default new ApiObjectMapper();