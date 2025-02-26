const express = require("express");
const {
	addProduct,
	updateProduct,
	deleteProduct,
	getProducts,
	getUsers,
	updateUserRole,
	deleteUser,
	getOrders,
	updateOrderStatus,
	createCoupon,
	assignCouponToUsers,
	getCoupons,
	deleteCoupon,
	getDashboardStats,
} = require("../controllers/adminController");

const {
	verifyToken,
	authenticateAdmin,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Product Routes
router.post("/product", authenticateAdmin, addProduct);
router.put("/product/:id", authenticateAdmin, updateProduct);
router.delete("/product/:id", authenticateAdmin, deleteProduct);
router.get("/products", authenticateAdmin, getProducts);

// User Management Routes
router.get("/users", authenticateAdmin, getUsers);
router.put("/users/:id", authenticateAdmin, updateUserRole);
router.delete("/users/:id", authenticateAdmin, deleteUser);

// Order Management Routes
router.get("/orders", authenticateAdmin, getOrders);
router.put("/orders/:id", authenticateAdmin, updateOrderStatus);

// Coupon Management Routes
router.post("/coupon", authenticateAdmin, createCoupon);
router.post("/coupon/assign-coupon", authenticateAdmin, assignCouponToUsers);
router.get("/coupons", authenticateAdmin, getCoupons);
router.delete("/coupon/:id", authenticateAdmin, deleteCoupon);

// Dashboard Stats
router.get("/dashboard/stats", authenticateAdmin, getDashboardStats);

module.exports = router;
