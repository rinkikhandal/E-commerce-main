import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "product",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    countOfProduct: {
      type: Number,
      required: true,
    },
  },
  { timestamp: true }
);

export default mongoose.model("Order", orderSchema);
