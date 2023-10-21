const express = require("express");
const router = express.Router();
const {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
} = require("../controller/orderController.js");
const { protect, admin } = require("../middleware/authMiddleware.js");

router
  .route("/")
  .post(protect, addOrderItems)
  .get(protect, getMyOrders)
  .get(protect, admin, getOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

module.exports = router;
