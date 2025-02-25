// models/Cart.js
const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
	product_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product",
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	brand: {
		type: String,
		required: true,
	},
	size: {
		type: String,
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
		default: 1,
	},
	price: {
		type: Number,
		required: true,
	},
	mrp: {
		type: Number,
		required: true,
	},
	discount_percentage: {
		type: Number,
		required: true,
	},
});

const cartSchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
		unique: true,
	},
	items: [cartItemSchema],
	applied_coupon: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Coupon",
	},
	available_coupons: [String], // List of applicable coupon codes
	price_details: {
		total_mrp: {
			type: Number,
			default: 0,
		},
		discount_on_mrp: {
			type: Number,
			default: 0,
		},
		coupon_discount: {
			type: Number,
			default: 0,
		},
		platform_fee: {
			type: Number,
			default: 0,
		},
		shipping_fee: {
			type: Number,
			default: 0,
		},
		total_amount: {
			type: Number,
			default: 0,
		},
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
	updated_at: {
		type: Date,
		default: Date.now,
	},
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
