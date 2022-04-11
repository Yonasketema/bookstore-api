const express = require("express");
const bookController = require("./../controller/bookController");
const authController = require("./../controller/authController");

const router = express.Router();

router.route("/like").put(authController.protect, bookController.like);
router.route("/unlike").put(authController.protect, bookController.unlike);
router.route("/save").put(authController.protect, bookController.saveBook);
router.route("/unsave").put(authController.protect, bookController.unsaveBook);

router
  .route("/")
  .get(bookController.getAllBooks)
  .put(authController.protect, bookController.like)
  .post(bookController.createBook);

router.route("/:id").get(bookController.getBook);

module.exports = router;
