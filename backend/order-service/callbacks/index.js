const OrderModel = require("../models/order.model");

module.exports = {
  createOrder: async (payload) => {
    // do the stuff here
    const { _id, price } = payload?.product;
    const createOrder = await OrderModel.create({
      userId: payload.userId,
      products: [_id],
      totalPrice: price,
    });
    return createOrder;
  },
  listOrders: async (payload) => {
    const { userId } = payload;
    const orders = await OrderModel.find({ userId: userId });
    return { orders };
  },
  createBulkOrder: async (payload) => {
    // do the stuff here
    console.log(payload);
  },
};
