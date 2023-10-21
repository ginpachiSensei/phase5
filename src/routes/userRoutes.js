const express = require("express");
const router = express.Router();
const {
  registerUser,
  confirmUserEmail,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require("../controller/userController.js");
const { protect, admin } = require("../middleware/authMiddleware.js");

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.get("/confirm", confirmUserEmail);
router.post("/login", authUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

module.exports = router;
