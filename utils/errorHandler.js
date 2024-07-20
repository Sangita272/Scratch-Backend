const { HttpStatus } = require("./httpStatus");

const errorHandler = (error, params = {}) => {
  if (error.name === "ValidationError") {
    const errors = {};

    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    return {
      status: HttpStatus.BAD_REQUEST,
      message: error.message,
      error: errors,
    };
  }

  if (error.code && error.code === 11000) {
    return {
      status: HttpStatus.BAD_REQUEST,
      message: `${Object.keys(error.keyValue)[0]} already exists`,
    };
  }

  params = JSON.stringify(params);
  return {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: error.message,
    error,
  };
};

module.exports = { errorHandler };
