const express = require("express");
const { getProducts } = require("../controllers/plpController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/products", verifyToken, getProducts);

module.exports = router;