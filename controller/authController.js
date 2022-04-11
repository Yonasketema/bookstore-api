const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../helper/catchAsync");
const AppError = require("./../helper/appError");

exports.signup = catchAsync(async (req, res) => {
  const user = await User.create({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRE_IN,
  });

  res.status(201).json({
    status: "success",
    data: {
      token,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.PasswordCorrect(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRE_IN,
  });

  res.status(201).json({
    status: "success",
    data: {
      token,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //get token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  //verify the token
  let decoded;
  jwt.verify(token, process.env.SECRET_KEY, (err, dec) => {
    decoded = { ...dec };
    if (err) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }
  });

  //check if the user exit
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  //check the user is changed password after the token create
  if (user.changePasswordAt(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  req.user = user;

  /// Access to portected route
  next();
});
