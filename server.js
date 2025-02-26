const express = require("express");
const connectDB = require("./db");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const homeRoutes = require("./routes/homeRoutes");
const plpRoutes = require("./routes/plpRoutes");
const pdpRoutes = require("./routes/pdpRoutes");
const cartRoutes = require("./routes/cartRoutes");
const couponRoutes = require("./routes/couponRoutes");
const addressRoutes = require("./routes/addressRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

//routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/plp", plpRoutes);
app.use("/api/pdp", pdpRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 8000;
// Start the server
app.listen(PORT, () => {
	console.log(`Server started running on port ${PORT}`);
});
