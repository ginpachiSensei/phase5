const express = require("express");
const router = express.Router();
const { getProducts } = require("../controller/productController.js");

router.get("/", getProducts);

module.exports = router;
