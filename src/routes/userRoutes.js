const express = require("express");
const router = express.Router();
const {
  registerUser,
  confirmUserEmail,
  authUser,
  getUserProfile,
  updateUserProfile,
} = require("../controller/userController.js");
const { protect } = require("../middleware/authMiddleware.js");

router.route("/").post(registerUser);
router.get("/confirm", confirmUserEmail);
router.post("/login", authUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;
