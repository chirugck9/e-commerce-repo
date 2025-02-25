// models/Order.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
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

const paymentSchema = new mongoose.Schema({
	payment_method: {
		type: String,
		required: true,
	},
	transaction_id: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	payment_date: {
		type: Date,
		default: Date.now,
	},
});

const orderSchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	order_date: {
		type: Date,
		default: Date.now,
	},
	order_status: {
		type: String,
		enum: ["Placed", "Shipped", "Delivered", "Cancelled"],
		default: "Placed",
	},
	payment_status: {
		type: String,
		enum: ["Pending", "Success", "Failed"],
		default: "Pending",
	},
	items: [orderItemSchema],
	price_details: {
		total_mrp: {
			type: Number,
			required: true,
		},
		discount_on_mrp: {
			type: Number,
			required: true,
		},
		coupon_discount: {
			type: Number,
			required: true,
		},
		platform_fee: {
			type: Number,
			required: true,
		},
		shipping_fee: {
			type: Number,
			required: true,
		},
		total_amount: {
			type: Number,
			required: true,
		},
	},
	delivery_address: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Address",
		required: true,
	},
	payment_details: paymentSchema,
	created_at: {
		type: Date,
		default: Date.now,
	},
	updated_at: {
		type: Date,
		default: Date.now,
	},
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
