const Book = require("./../models/bookModel");
const User = require("./../models/userModel");
const catchAsync = require("./../helper/catchAsync");
const AppError = require("./../helper/appError");

exports.getAllBooks = catchAsync(async (req, res, next) => {
  let query = Book.find();

  if (req.query.select) {
    const genre = req.query.select;

    query = query.find({ genre: genre });
  } else {
    query = query.select("-__v");
  }

  const books = await query;

  res.status(200).json({
    status: "sucess",
    result: books.length,
    data: {
      books,
    },
  });
});

exports.getBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id)
    .populate("reviews")
    .select("reviews");

  if (!book) {
    return next(new AppError("No book found with is ID", 404));
  }

  res.status(200).json({
    status: "sucess",
    data: {
      book,
    },
  });
});

exports.like = catchAsync(async (req, res, next) => {
  const result = await Book.findByIdAndUpdate(
    req.body.bookId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  );

  if (!result) {
    return next(new AppError("No book found with is ID", 404));
  }

  res.status(200).json({
    result,
  });
});
exports.unlike = catchAsync(async (req, res, next) => {
  const result = await Book.findByIdAndUpdate(
    req.body.bookId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  );

  if (!result) {
    return next(new AppError("No book found with is ID", 404));
  }

  res.status(200).json({
    result,
  });
});

exports.saveBook = catchAsync(async (req, res, next) => {
  const result = await User.findByIdAndUpdate(
    req.user._id,
    {
      $push: { savedBooks: req.body.bookId },
    },
    {
      new: true,
    }
  );

  if (!result) {
    return next(new AppError("No book found with is ID", 404));
  }

  res.status(200).json({
    result,
  });
});

exports.unsaveBook = catchAsync(async (req, res, next) => {
  const result = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { savedBooks: req.body.bookId },
    },
    {
      new: true,
    }
  );

  if (!result) {
    return next(new AppError("No book found with is ID", 404));
  }

  res.status(200).json({
    result,
  });
});

exports.createBook = catchAsync(async (req, res, next) => {
  const newBook = await Book.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newBook,
    },
  });
});
