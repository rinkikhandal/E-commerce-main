import mongoose from "mongoose";

const cartItemsSchema = mongoose.Schema({
  quantity: {
    type: Number,
    default: 1,
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("CartItems", cartItemsSchema);
