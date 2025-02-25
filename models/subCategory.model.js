// models/Subcategory.js
const mongoose = require("mongoose");
const Counter = require("./counter.model");

const subcategorySchema = new mongoose.Schema({
	id: {
		type: Number,
		unique: true,
	},
	name: {
		type: String,
		required: true,
	},
	items: [String],
	created_at: {
		type: Date,
		default: Date.now,
	},
	updated_at: {
		type: Date,
		default: Date.now,
	},
});

// Auto-increment ID
subcategorySchema.pre("save", async function (next) {
	if (!this.isNew) return next();

	try {
		const counter = await Counter.findOneAndUpdate(
			{ name: "subcategory" },
			{ $inc: { value: 1 } },
			{ new: true, upsert: true }
		);
		this.id = counter.value;
		next();
	} catch (error) {
		next(error);
	}
});

module.exports = mongoose.model("Subcategory", subcategorySchema);
