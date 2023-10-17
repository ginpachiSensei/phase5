const express = require("express");
const router = express.Router();
const { testGet, testPost } = require("../controller/userController.js");

router.get("/", testGet);
router.post("/test", testPost);

module.exports = router;
