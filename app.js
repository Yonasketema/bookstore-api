const express = require("express");
const cors = require("cors");

const bookRouter = require("./routes/bookRoute");
const userRouter = require("./routes/userRoute");
const reviewRoute = require("./routes/reviewRoute");
const AppError = require("./helper/appError");
const errorHandler = require("./helper/errorHandler");

app = express();

//Middlewares
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRoute);

//unhandle route handler
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//Global error handler
app.use(errorHandler);

module.exports = app;
