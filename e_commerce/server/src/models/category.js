import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
  ],
  mainCategory: {
    type: String,
    required: true,
  },

  subCategory: {
    type: String,
    default: "",
  },
});

export default mongoose.model("Category", categorySchema);
