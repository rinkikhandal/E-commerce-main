import { StatusCodes } from "http-status-codes";
import { NotFound } from "../errors/customApiError";
import CartItems from "../models/cartItems";
import Product from "../models/products";

const getAllCartItems = async (req, res) => {
  const { userId } = req.user;
  const cartItems = await CartItems.find({ user: userId }).populate({
    path: "product",
    select: "_id productName price image ",
  });

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "",
    data: cartItems,
  });
};

const addCartItem = async (req, res) => {
  const {
    params: { productId },
    user: { userId },
  } = req;
  const product = await Product.findOne({ _id: productId, deleted: false });
  if (!product) {
    throw new NotFound("product not found");
  }
  const cartItem = await CartItems.create({
    product: productId,
    user: userId,
  });

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "successfully added to cart",
    data: cartItem,
  });
};

const updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const cartItem = await CartItems.findOneAndUpdate(
    { product: productId },
    { quantity: req.body.quantity },
    { new: true, runValidators: true }
  );

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "",
    data: cartItem,
  });
};

const deleteCartItem = async (req, res) => {
  const { productId } = req.params;
  const deleteItem = await CartItems.findOneAndDelete({ product: productId });
  return res.status(StatusCodes.OK).json({
    success: true,
    message: "successfully deleted",
    data: null,
  });
};

export { getAllCartItems, addCartItem, updateCartItem, deleteCartItem };
