const express = require("express");

const {
	createCoupon,
	getAvailableCoupons,
} = require("../controllers/couponController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", verifyToken, createCoupon);
router.get("/available/:user_id", verifyToken, getAvailableCoupons);

module.exports = router;
