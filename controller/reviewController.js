const Review = require("./../models/reviewModel");
const catchAsync = require("./../helper/catchAsync");
const AppError = require("./../helper/appError");

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const review = await Review.find();

  res.status(200).json({
    status: "success",
    results: review.length,
    data: {
      review,
    },
  });
});

exports.createReviews = catchAsync(async (req, res, next) => {
  const review = await Review.create({
    review: req.body.review,
    book: req.body.book,
    user: req.user._id,
  });

  res.status(201).json({
    status: "success",
    results: review.length,
    data: {
      review,
    },
  });
});
