const express = require("express");
const { getProductById } = require("../controllers/pdpController");
const {
	verifyToken,
	authenticateAdmin,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get(
	"/product/:productId",
	verifyToken,
	authenticateAdmin,
	getProductById
);

module.exports = router;
