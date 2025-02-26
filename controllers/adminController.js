const Product = require("../models/product.model");
const User = require("../models/user.model");
const Order = require("../models/order.model");
const Coupon = require("../models/coupon.model");

//Product CRUD
exports.addProduct = async (req, res) => {
	try {
		const product = new Product(req.body);
		await product.save();
		res.status(201).json({ message: "Product added successfully", product });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.updateProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		res
			.status(200)
			.json({ message: "Product updated successfully", updatedProduct });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;
		await Product.findByIdAndDelete(id);
		res.status(200).json({ message: "Product deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.getProducts = async (req, res) => {
	try {
		const products = await Product.find();
		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

//User management
exports.getUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.updateUserRole = async (req, res) => {
	try {
		const { id } = req.params;
		const { role } = req.body;
		const user = await User.findByIdAndUpdate(id, { role }, { new: true });
		res.status(200).json({ message: "User role updated successfully", user });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		await User.findByIdAndDelete(id);
		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

//order management

exports.getOrders = async (req, res) => {
	try {
		const orders = await Order.find().populate("user_id").lean();
		res.status(200).json(orders);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.updateOrderStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { order_status } = req.body;
		const order = await Order.findByIdAndUpdate(
			id,
			{ order_status },
			{ new: true }
		);
		res.status(200).json({ message: "Order status updated", order });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Coupon Management

exports.createCoupon = async (req, res) => {
	try {
		const coupon = new Coupon(req.body);
		await coupon.save();
		res.status(201).json({ message: "Coupon created", coupon });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.assignCouponToUsers = async (req, res) => {
	try {
		const { coupon_id, user_ids } = req.body;

		if (!coupon_id || !Array.isArray(user_ids) || user_ids.length === 0) {
			return res.status(400).json({ error: "Invalid coupon ID or user IDs" });
		}

		const coupon = await Coupon.findById(coupon_id);
		if (!coupon) {
			return res.status(404).json({ error: "Coupon not found" });
		}

		// Check if all users exist
		const users = await User.find({ _id: { $in: user_ids } });
		if (users.length !== user_ids.length) {
			return res.status(400).json({ error: "Some users do not exist" });
		}

		// Assign users to the coupon (avoid duplicates)
		const uniqueUserIds = [...new Set([...coupon.users, ...user_ids])];
		coupon.users = uniqueUserIds;

		await coupon.save();

		return res.status(200).json({
			message: "Users assigned to coupon successfully",
			coupon,
		});
	} catch (error) {
		console.error("Error assigning users to coupon:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};
exports.getCoupons = async (req, res) => {
	try {
		const coupons = await Coupon.find();
		res.status(200).json(coupons);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.deleteCoupon = async (req, res) => {
	try {
		const { id } = req.params;
		await Coupon.findByIdAndDelete(id);
		res.status(200).json({ message: "Coupon deleted" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Dashboard Stats

exports.getDashboardStats = async (req, res) => {
	try {
		const totalUsers = await User.countDocuments();
		const totalProducts = await Product.countDocuments();
		const totalOrders = await Order.countDocuments();
		const totalRevenue = await Order.aggregate([
			{ $group: { _id: null, total: { $sum: "$total_amount" } } },
		]);

		res.status(200).json({
			totalUsers,
			totalProducts,
			totalOrders,
			totalRevenue: totalRevenue[0]?.total || 0,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
