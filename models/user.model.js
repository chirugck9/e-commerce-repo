// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
  },
  full_name: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"], 
    default: "user", 
  },
  is_active: {
    type: Boolean,
    required: true,
    default: true, 
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

module.exports = mongoose.model("User", userSchema);