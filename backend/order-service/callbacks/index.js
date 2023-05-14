const OrderModel = require("../models/order.model");

module.exports = {
  createOrder: async (payload) => {
    // do the stuff here
    const { _id, price } = payload?.product;
    console.log(_id);
    const createOrder = await OrderModel.create({
      userId: payload.userId,
      products: [_id],
      totalPrice: price,
    });
    return createOrder;
  },
  createBulkOrder: async (payload) => {
    // do the stuff here
    console.log(payload);
  },
};
