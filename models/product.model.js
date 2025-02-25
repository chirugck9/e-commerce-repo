// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	description: {
		type: String,
	},
	brand: {
		type: String,
	},
	price: {
		type: Number,
		required: true,
	},
	discount_price: {
		type: Number,
	},
	discount_percentage: {
		type: Number,
	},
	category_id: {
		type: Number,
		ref: "Category",
		required: true,
	},
	subcategory_id: {
		type: Number,
		ref: "Subcategory",
		required: true,
	},
	images: [String],
	sizes: [String],
	colors: [String],
	delivery_options: [String], // e.g., ["Free Shipping", "COD Available"]
	best_offers: [String], // e.g., ["10% off on prepaid orders"]
	specifications: {
		fabric: String,
		fit: String,
		length: String,
		neck: String,
		occasion: String,
	},
	ratings: {
		average_rating: Number,
		total_reviews: Number,
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

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
