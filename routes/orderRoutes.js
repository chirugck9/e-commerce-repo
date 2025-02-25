const express = require("express");
const {
	placeOrder,
	getOrders,
	getOrderDetails,
	updateOrderStatus,
} = require("../controllers/orderController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/place", verifyToken, placeOrder);
router.get("/:user_id", verifyToken, getOrders);
router.get("/details/:user_id", verifyToken, getOrderDetails);
router.put("/update-status", verifyToken, updateOrderStatus);

module.exports = router;
