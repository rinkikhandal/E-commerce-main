import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import User from "../models/user";
import crypto from "crypto";

import {
  BadRequest,
  NotFound,
  UnAuthorizedAccess,
} from "../errors/customApiError";
import {
  generateAuthToken,
  generateResetToken,
  verifyAuthToken,
  verifyResetToken,
} from "../utils/auth";
import sendVerificationEmail from "../utils/emails/sendverification";

const registerUser = async (req, res) => {
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    let errorMsg = validation.errors.map((err) => err.msg).join(",");

    throw new BadRequest(errorMsg || "please provide all required fields");
  }
  let userDetails = { ...req.body };
  // first registered user will be admin
  const isFirstAccount = (await User.countDocuments({})) === 0;

  if (isFirstAccount) {
    userDetails = { ...userDetails, isAdmin: true };
  }

  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({ ...userDetails, verificationToken });

  const origin = "http://localhost:3030";

  await sendVerificationEmail({
    name: user.username,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });

  // verificationToken only sent while testing in postman
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Success! Please check your email to verify your account",
    // verificationToken: user.verificationToken,
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email, deleted: false });
  if (!user) {
    throw new NotFound("user not found");
  }

  if (!user.verificationToken === verificationToken) {
    throw new UnAuthorizedAccess(
      "Please check the verification token there seems to be a problem"
    );
  }

  const extraDetails = {
    isVerified: true,
    verified: Date.now(),
    verificationToken: "",
  };

  const user1 = await User.findOneAndUpdate(
    { email: user.email },
    { ...extraDetails },
    { new: true, runValidators: true }
  );

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Email Verified", data: null });
};

const loginUser = async (req, res) => {
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    const errorMsg = validation.errors.map((obj) => obj.msg).join(", ");
    throw new BadRequest(errorMsg || "please provide all required fields");
  }

  const { email, password: passwordToCompare } = req.body;

  // Find the user by email (case-sensitive)
  const user = await User.findOne({ email, deleted: false });

  if (!user) {
    throw new NotFound("User not found");
  }

  // Check if the user is verified
  if (!user.isVerified) {
    throw new UnAuthorizedAccess("Please verify your email");
  }

  // Compare passwords only if the user is found
  const isCorrectPassword = await user.comparePassword(passwordToCompare);

  if (!isCorrectPassword) {
    throw new UnAuthorizedAccess("Invalid Credentials");
  }

  const { password, deleted, adminGrantingUserId, isAdmin, ...rest } =
    user.toObject();

  const token = generateAuthToken({
    userId: user._id,
    username: user.username,
    email: user.email,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "User login successful",
    data: { userDetails: rest, token },
  });
};

const validateToken = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw new UnAuthorizedAccess("token not found");
  }

  const user = verifyAuthToken(token);

  const { password, deleted, adminGrantingUserId, isAdmin, ...rest } =
    user.toObject();

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "User created successfully",
    data: { userDetails: rest },
  });
};

const forgotPassword = async (req, res) => {
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    const errorMsg = validation.errors.map((obj) => obj.msg).join(", ");

    throw new BadRequest(errorMsg || "please provide all required fields");
  }

  const { email } = req.body;

  const user = await User.findOne({ email, deleted: false });

  if (!user) {
    throw new UnAuthorizedAccess("Invalid Credentials");
  }

  const token = generateResetToken({ email: user.email });

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "check your email for validation and reset your password",
    data: {
      link: "link",
      token,
    },
  });
};

const resetPassword = async (req, res) => {
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    const errorMsg = validation.errors.map((obj) => obj.msg).join(", ");

    throw new BadRequest(errorMsg || "please provide all required fields");
  }

  const { token } = req.params;
  const verified = verifyResetToken(token);

  const { password } = req.body;

  await User.findOneAndUpdate({ email: verified.email }, { password });

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "password set successfully",
    data: null,
  });
};

export {
  registerUser,
  loginUser,
  validateToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
