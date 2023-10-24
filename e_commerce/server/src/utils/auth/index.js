import jwt from "jsonwebtoken";

export const generateAuthToken = (payload) =>
  jwt.sign(payload, process.env.JWT_AUTH_SECRET, {
    expiresIn: process.env.EXP_OF_AUTH,
  });

export const verifyAuthToken = (token) =>
  jwt.verify(token, process.env.JWT_AUTH_SECRET);

export const generateResetToken = (payload) =>
  jwt.sign(payload, process.env.JWT_RESET_SECRET, {
    expiresIn: process.env.EXP_OF_RESET,
  });

export const verifyResetToken = (resetToken) =>
  jwt.verify(resetToken, process.env.JWT_RESET_SECRET);

// const hashPassword = async (password) => {
//   const salt = await bcrypt.genSalt(10);
//   const hashPassword = await bcrypt.hash(password, salt);
//   return hashPassword;
// };

// const comparePassword = async (password,)
