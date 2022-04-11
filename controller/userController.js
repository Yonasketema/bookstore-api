const User = require("./../models/userModel");

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }

  // if (!result) {
  //   return next(new AppError("No book found with is ID", 404));
  // }
};

exports.AllSaveBooks = async (req, res) => {
  const user = await User.findById(req.user._id).populate("savedBooks");

  res.status(200).json({
    status: "sucess",

    data: {
      user,
    },
  });

  // if (!result) {
  //   return next(new AppError("No book found with is ID", 404));
  // }
};
