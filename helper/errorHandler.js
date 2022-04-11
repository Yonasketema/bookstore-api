const AppError = require("./appError");

//NODE_ENV === 'development'
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path} :${error.value}`;

  return new AppError(message, 400);
};

const handleDuplicateErrorDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `duplicate key error collection ${value}`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

//NODE_ENV === 'production'
const sendErrorPro = (err, res) => {
  //Operational error from AppError.js

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //Programming or unknown Error
  } else {
    console.error(err);

    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

//Global error handler | Controller
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "production") {
    let error = JSON.parse(JSON.stringify(err));
    error.message = err.message;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateErrorDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);

    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorPro(error, res);
  } else if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  }
};

module.exports = errorHandler;
