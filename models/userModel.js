const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please tell us your name"],
    },
    age: {
      type: Number,
    },
    email: {
      type: String,
      required: [true, "please tell us your email address"],
      unique: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    password: {
      type: String,
      minlength: 8,
      required: [true, "please provide a password"],
      select: false,
    },
    savedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],

    passwordConfirm: {
      type: String,
      required: [true, "please provide a passwordConfirm"],
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  //create password and update
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;

    next();
  }
  next();
});

userSchema.methods.PasswordCorrect = async function (
  enterPassword,
  dbPassword
) {
  return await bcrypt.compare(enterPassword, dbPassword);
};
userSchema.methods.changePasswordAt = function (iat) {
  if (this.passwordChangedAt) {
    const changePasswordAt = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return iat < changePasswordAt;
  }
  return false;
};

const User = new mongoose.model("User", userSchema);

// userSchema.methods.

module.exports = User;
