const express = require("express");
const {
	addToCart,
	getCart,
	applyCoupon,
	removeCoupon,
	updateCartItemQuantity,
	clearCart,
} = require("../controllers/cartController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", verifyToken, addToCart);
router.get("/:user_id", verifyToken, getCart);
router.put("/update", verifyToken, updateCartItemQuantity);
router.post("/apply-coupon", verifyToken, applyCoupon);
router.post("/remove-coupon", verifyToken, removeCoupon);
router.delete("/clear", verifyToken, clearCart);

module.exports = router;
