const express = require("express");
const { getProductById } = require("../controllers/pdpController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/product/:productId", verifyToken, getProductById);

module.exports = router;
