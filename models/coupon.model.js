// models/Coupon.js
const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
	code: {
		type: String,
		required: true,
		unique: true,
	},
	discount_percentage: {
		type: Number,
		required: true,
	},
	max_discount_amount: {
		type: Number,
		required: true,
	},
	min_order_amount: {
		type: Number,
		required: true,
	},
	valid_from: {
		type: Date,
		required: true,
	},
	valid_till: {
		type: Date,
		required: true,
	},
	is_active: {
		type: Boolean,
		default: true,
	},
	users: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
});

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
