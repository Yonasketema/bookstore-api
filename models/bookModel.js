const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: Array,
      required: [true, "a book must have title"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "a book must have author"],
    },
    publicationDate: {
      type: Date,
      default: Date.now,
      // required: [true, "a book must have year"],
    },
    genre: {
      type: String,
      required: [true, "a book must have a type"],
      enum: ["fiction", "bio", "historical", "startup", "science"],
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    img: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "book",
  localField: "_id",
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
