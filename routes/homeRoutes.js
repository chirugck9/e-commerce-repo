const express = require("express");
const { getAllCategories } = require("../controllers/homeController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/categories", verifyToken, getAllCategories);

module.exports = router;