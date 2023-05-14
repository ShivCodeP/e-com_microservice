const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    quantity: { type: Number, required: true },
    status: { type: String, required: true, default: "IN_CART" },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
