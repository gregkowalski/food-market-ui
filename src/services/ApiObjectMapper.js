import { DeliveryOptions } from "../Enums";

class ApiObjectMapper {

    mapOrders(orderDtos) {
        if (!orderDtos)
            return;

        orderDtos.forEach(x => {
            this.mapOrder(x);
        });
    }

    mapOrder(orderDto) {
        orderDto.pickup = orderDto.delivery_option === DeliveryOptions.pickup;
    }
}

export default new ApiObjectMapper();