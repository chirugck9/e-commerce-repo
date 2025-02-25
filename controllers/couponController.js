const Coupon = require("../models/coupon.model");

exports.createCoupon = async (req, res) => {
	try {
		const {
			code,
			discount_percentage,
			max_discount_amount,
			min_order_amount,
			valid_from,
			valid_till,
			is_active,
			users,
		} = req.body;

		const existingCoupon = await Coupon.findOne({ code });
		if (existingCoupon) {
			return res.status(400).json({ error: "Coupon code already exists" });
		}

		const coupon = new Coupon({
			code,
			discount_percentage,
			max_discount_amount,
			min_order_amount,
			valid_from: new Date(valid_from),
			valid_till: new Date(valid_till),
			is_active,
			users,
		});

		await coupon.save();

		return res
			.status(201)
			.json({ message: "Coupon created successfully", coupon });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

exports.getAvailableCoupons = async (req, res) => {
	try {
		const { user_id } = req.params;

		console.log("User ID:", user_id);
		console.log("Current Date:", new Date());
		// Fetch coupons that are active and either available for all users or assigned to the specific user
		const coupons = await Coupon.find({
			is_active: true,
			$or: [{ users: { $in: [user_id] } }, { users: { $size: 0 } }],
			valid_from: { $lte: new Date() },
			valid_till: { $gte: new Date() },
		});

		if (coupons.length === 0) {
			return res.status(404).json({ message: "No coupons available" });
		}

		console.log("Coupons Found:", coupons);

		return res.status(200).json(coupons);
	} catch (error) {
		console.error("Error:", error);

		return res.status(500).json({ error: "Internal server error" });
	}
};
