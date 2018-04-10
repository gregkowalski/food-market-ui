function updateOrderInMap(orders, order_id, updateCallback) {
    const updatedOrders = orders.map(order => {
        if (order.order_id === order_id) {
            return Object.assign({}, order, updateCallback({}));
        }
        return order;
    });

    return updatedOrders;
}

export function updateOrder(state, action, updateProps) {
    const newState = Object.assign({}, state, {
        orders: updateOrderInMap(state.orders, action.order.order_id, (o) => {
            return Object.assign({}, o, updateProps);
        })
    });
    return newState;
}