// models/Category.js
const mongoose = require("mongoose");
const Counter = require("./counter.model");

const categorySchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true
   },
  subcategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
    },
  ],
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
categorySchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  try {
    const counter = await Counter.findOneAndUpdate(
      { name: "category" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    this.id = counter.value;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Category", categorySchema);