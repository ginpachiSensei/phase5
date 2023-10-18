const express = require("express");
const router = express.Router();
const {
  registerUser,
  confirmUserEmail,
} = require("../controller/userController.js");

router.route("/").post(registerUser);
router.get("/confirm", confirmUserEmail);

module.exports = router;
