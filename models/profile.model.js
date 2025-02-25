const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    full_name: { 
      type: String,
      required: true 
    },
    email: { 
      type: String, 
      required: true 
    },
    age: { 
      type: Number 
    },
    phone_number: {
      type: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    profile_image: {
      type: String,
      default: "https://via.placeholder.com/150", // Default image
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;