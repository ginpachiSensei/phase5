const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
} = require("../controller/productController.js");
const { protect, admin } = require("../middleware/authMiddleware.js");

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.get("/:id", getProductById);

module.exports = router;
