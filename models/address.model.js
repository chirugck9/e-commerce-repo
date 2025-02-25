// models/Address.js
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	full_name: {
		type: String,
		required: true,
	},
	phone_number: {
		type: String,
		required: true,
	},
	address_line1: {
		type: String,
		required: true,
	},
	address_line2: {
		type: String,
	},
	city: {
		type: String,
		required: true,
	},
	state: {
		type: String,
		required: true,
	},
	pincode: {
		type: String,
		required: true,
	},
	landmark: {
		type: String,
	},
	is_default: {
		type: Boolean,
		default: false,
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

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
