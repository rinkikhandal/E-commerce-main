import express from "express";
const router = express.Router();
import { body, param } from "express-validator";
import {
  registerUser,
  loginUser,
  resetPassword,
  validateToken,
  forgotPassword,
  verifyEmail,
} from "../controllers/user";

// password validator
const passwordValidation = body("password")
  .isLength({ min: 4 })
  .withMessage("Password should be at least 4 characters long")
  .matches(/\d/)
  .withMessage("Password should contain at least one number")
  .matches(/[a-zA-Z]/)
  .withMessage("Password should contain at least one letter");

router.route("/register").post(passwordValidation, registerUser);

router.route("/login").post(passwordValidation, loginUser);
router.route("/forgot-password").post(forgotPassword);
router
  .route("/reset-password/:token")
  .post(
    passwordValidation,
    param("token").isJWT().withMessage("Invalid token"),
    resetPassword
  );
router.route("/verify-email").post(verifyEmail);
router.route("/validate/:token").get(validateToken);

export default router;
