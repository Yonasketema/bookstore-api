const express = require("express");
const reviewController = require("./../controller/reviewController");
const authController = require("./../controller/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, reviewController.getAllReviews)
  .post(authController.protect, reviewController.createReviews);

module.exports = router;
