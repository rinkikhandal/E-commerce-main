import { StatusCodes } from "http-status-codes";

class CustomApiError extends Error {
  constructor(message) {
    super(message);
  }
}

export class NotFound extends CustomApiError {
  constructor(message) {
    super(message);
    this.status = StatusCodes.NOT_FOUND;
  }
}

export class BadRequest extends CustomApiError {
  constructor(message) {
    super(message);
    this.status = StatusCodes.BAD_REQUEST;
  }
}

export class UnAuthorizedAccess extends CustomApiError {
  constructor(message) {
    super(message);
    this.status = StatusCodes.UNAUTHORIZED;
  }
}
