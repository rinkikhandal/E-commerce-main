import { StatusCodes } from "http-status-codes";
import logger from "../utils/logger/logs";
import { log } from "winston";

const errorHandler = (err, req, res, next) => {
  let customError = {
    message: err.message || "something went wrong please try again later",
    status: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (err.name === "ValidationError") {
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.status = StatusCodes.BAD_REQUEST;
  }

  if (err.code && err.code === 1100) {
    customError.status = StatusCodes.BAD_REQUEST;
    customError.message = `Duplicate value for ${Object.keys(
      err.keyValue
    )}, please choose another value`;
  }

  if (err.name === "CastError") {
    customError.message = `No item with id ${err.value}`;
    customError.status = StatusCodes.NOT_FOUND;
  }

  logger.error(customError);

  return res.status(customError.status).json({
    success: false,
    message: customError.message,
    data: null,
  });
};

export default errorHandler;
