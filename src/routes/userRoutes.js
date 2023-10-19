const express = require("express");
const router = express.Router();
const {
  registerUser,
  confirmUserEmail,
  authUser,
} = require("../controller/userController.js");

router.route("/").post(registerUser);
router.get("/confirm", confirmUserEmail);
router.post("/login", authUser);

module.exports = router;
