import express from "express";
const router = express.Router();
import {
  getAllCartItems,
  addCartItem,
  updateCartItem,
  deleteCartItem,
} from "../controllers/cartItems";

router.route("/").get(getAllCartItems);
router
  .route("/:productId")
  .post(addCartItem)
  .patch(updateCartItem)
  .delete(deleteCartItem);

export default router;
