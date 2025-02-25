const express = require("express");

const {
	createPaymentIntent,
	confirmPayment,
} = require("../controllers/paymentController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create-payment-intent", verifyToken, createPaymentIntent);
router.post("/confirm-payment", verifyToken, confirmPayment);

module.exports = router;
