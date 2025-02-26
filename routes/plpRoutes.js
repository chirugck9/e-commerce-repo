const express = require("express");
const { getProducts } = require("../controllers/plpController");
const {
	verifyToken,
	authenticateAdmin,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/products", verifyToken, authenticateAdmin, getProducts);

module.exports = router;
