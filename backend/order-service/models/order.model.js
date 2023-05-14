const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    products: [{ type: mongoose.Types.ObjectId, required: true }],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "NOT_PAID" },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
