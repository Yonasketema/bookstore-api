const express = require("express");
const authController = require("./../controller/authController");
const userController = require("./../controller/userController");

const router = express.Router();

router.get("/profile", authController.protect, userController.profile);
router.get("/savedbooks", authController.protect, userController.AllSaveBooks);
router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;
