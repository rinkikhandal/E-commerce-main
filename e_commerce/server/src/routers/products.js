import express from "express";
import authenticateUser, { adminAuth } from "../middlewares/auth";
import {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  // uploadImage,
} from "../controllers/products";
const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(authenticateUser, adminAuth, addProduct);
router
  .route("/product/:productId")
  .get(getSingleProduct)
  .patch(authenticateUser, adminAuth, updateProduct)
  .delete(authenticateUser, adminAuth, deleteProduct);

// router.route("/image").post(uploadImage);

export default router;
