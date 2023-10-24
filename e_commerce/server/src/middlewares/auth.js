import { verifyAuthToken } from "../utils/auth";
import { StatusCodes } from "http-status-codes";
import User from "../models/user";
import { UnAuthorizedAccess } from "../errors/customApiError";

const authenticateUser = async (req, res, next) => {
  const tokenString = req.headers.authorization;

  if (!tokenString || !tokenString.startsWith("Bearer ")) {
    throw new UnAuthorizedAccess("token required or incorrect");
  }

  const token = tokenString.split(" ")[1];

  const payload = verifyAuthToken(token);

  req.user = {
    userId: payload.userId,
    username: payload.username,
    email: payload.email,
  };

  next();
};

export const adminAuth = async (req, res, next) => {
  const { userId } = req.user;
  const user = await User.findOne({ _id: userId }).select("isAdmin");
  // console.log(user.isAdmin);

  if (!user.isAdmin) {
    throw new UnAuthorizedAccess("unAuthorized Access");
  } else {
    next();
  }
};

export default authenticateUser;
