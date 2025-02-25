const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const Coupon = require("../models/coupon.model");
const getAvailableCoupons = require("../controllers/couponController");

exports.addToCart = async (req, res) => {
	try {
		const { user_id, product_id, size, quantity } = req.body;

		const product = await Product.findById(product_id);
		console.log(product);
		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}

		const price = product.discount_price || product.price;

		let cart = await Cart.findOne({ user_id });
		if (!cart) {
			cart = new Cart({ user_id, items: [], price_details: {} });
		}

		console.log(cart, "cart");
		// Check if the product already exists in the cart
		const existingItem = cart.items.find(
			(item) => item.product_id.toString() === product_id && item.size === size
		);

		if (existingItem) {
			existingItem.quantity += quantity;
		} else {
			cart.items.push({
				product_id,
				name: product.name,
				image: product.images[0],
				brand: product.brand,
				size,
				quantity,
				price,
				mrp: product.price,
				discount_percentage: product.discount_percentage,
			});
		}

		// Update price details
		cart.price_details.total_mrp = cart.items.reduce(
			(total, item) => total + item.mrp * item.quantity,
			0
		);

		cart.price_details.discount_on_mrp = cart.items.reduce(
			(total, item) => total + (item.mrp - item.price) * item.quantity,
			0
		);

		cart.price_details.total_amount =
			cart.price_details.total_mrp -
			cart.price_details.discount_on_mrp +
			cart.price_details.platform_fee +
			cart.price_details.shipping_fee;

		await cart.save();

		return res.status(200).json({ message: "Product added to cart", cart });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};

exports.getCart = async (req, res) => {
	try {
		const { user_id } = req.params;
		console.log("user id:", user_id);

		const cart = await Cart.findOne({ user_id })
			.populate("applied_coupon")
			.lean();
		if (!cart) {
			return res.status(404).json({ error: "Cart not found" });
		}

		const availableCoupons = await Coupon.find({
			is_active: true,
			$or: [{ users: { $in: [user_id] } }, { users: { $size: 0 } }],
			valid_from: { $lte: new Date() },
			valid_till: { $gte: new Date() },
		});

		cart.available_coupons = availableCoupons;

		return res.status(200).json(cart);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

exports.applyCoupon = async (req, res) => {
	try {
		const { user_id, coupon_code } = req.body;

		const cart = await Cart.findOne({ user_id });
		if (!cart) {
			return res.status(404).json({ error: "Cart not found" });
		}

		// Fetch the coupon
		const coupon = await Coupon.findOne({
			code: coupon_code,
			is_active: true,
			valid_from: { $lte: new Date() },
			valid_till: { $gte: new Date() },
			$or: [{ users: { $in: [user_id] } }, { users: { $size: 0 } }],
		});

		if (!coupon) {
			return res.status(404).json({ error: "Invalid or expired coupon" });
		}

		// Check if the cart meets the minimum order amount
		if (cart.price_details.total_mrp < coupon.min_order_amount) {
			return res.status(400).json({ error: "Coupon not applicable" });
		}

		const couponDiscount = Math.min(
			(coupon.discount_percentage / 100) * cart.price_details.total_mrp,
			coupon.max_discount_amount
		);

		cart.price_details.coupon_discount = couponDiscount;
		cart.applied_coupon = coupon._id; // Add this line to save the applied coupon
		cart.price_details.total_amount =
			cart.price_details.total_mrp -
			cart.price_details.discount_on_mrp -
			cart.price_details.coupon_discount +
			cart.price_details.platform_fee +
			cart.price_details.shipping_fee;

		await cart.save();

		return res.status(200).json({ message: "Coupon applied", cart });
	} catch (error) {
		return res.status(500).json({ error: "Internal server error" });
	}
};

exports.removeCoupon = async (req, res) => {
	try {
		const { user_id } = req.body;
		console.log(user_id);
		let cart = await Cart.findOne({ user_id });
		if (!cart) {
			return res.status(404).json({ error: "Cart not found" });
		}

		cart.applied_coupon = null;
		cart.price_details.coupon_discount = 0;
		cart.price_details.total_amount =
			cart.price_details.total_mrp - cart.price_details.discount_on_mrp;

		await cart.save();
		return res
			.status(200)
			.json({ message: "Coupon removed successfully", cart });
	} catch (error) {
		return res.status(500).json({ error: "Internal server error" });
	}
};
exports.updateCartItemQuantity = async (req, res) => {
	try {
		const userId = req.user.firebaseuid;
		const { product_id, size, quantity } = req.body;

		// Find the user's cart
		const cart = await Cart.findOne({ userId });
		if (!cart) {
			return res.status(404).json({ error: "Cart not found" });
		}

		// Find the item in the cart
		const item = cart.items.find(
			(item) => item.product_id.toString() === product_id && item.size === size
		);
		if (!item) {
			return res.status(404).json({ error: "Item not found in cart" });
		}

		// Update quantity
		item.quantity = quantity;

		// Update price details
		cart.price_details.total_mrp = cart.items.reduce(
			(total, item) => total + item.mrp * item.quantity,
			0
		);
		cart.price_details.discount_on_mrp = cart.items.reduce(
			(total, item) => total + (item.mrp - item.price) * item.quantity,
			0
		);
		cart.price_details.total_amount =
			cart.price_details.total_mrp -
			cart.price_details.discount_on_mrp +
			cart.price_details.platform_fee +
			cart.price_details.shipping_fee;

		await cart.save();

		res.status(200).json({ message: "Cart updated", cart });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Something went wrong" });
	}
};

exports.clearCart = async (req, res) => {
	try {
		const userId = req.user.firebaseuid;
		await Cart.findOneAndDelete({ userId });

		return res.status(200).json({ message: "Cart cleared" });
	} catch (error) {
		return res
			.status(500)
			.json({ error: "Error clearing cart", message: error.message });
	}
};
