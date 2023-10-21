const express = require("express");
const router = express.Router();
const {
  addOrderItems,
  getMyOrders,
  getOrderById,
} = require("../controller/orderController.js");
const { protect } = require("../middleware/authMiddleware.js");

router.route("/").post(protect, addOrderItems).get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);

module.exports = router;
