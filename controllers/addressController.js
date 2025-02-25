const Address = require("../models/address.model");

exports.addAddress = async (req, res) => {
	try {
		const {
			user_id,
			full_name,
			phone_number,
			address_line1,
			address_line2,
			city,
			state,
			pincode,
			landmark,
		} = req.body;

		const address = new Address({
			user_id,
			full_name,
			phone_number,
			address_line1,
			address_line2,
			city,
			state,
			pincode,
			landmark,
		});

		await address.save();

		res.status(201).json({ message: "Address added successfully", address });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Something went wrong" });
	}
};

exports.getAddresses = async (req, res) => {
	try {
		const { user_id } = req.params;

		const addresses = await Address.find({ user_id });

		res.status(200).json(addresses);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Something went wrong" });
	}
};

// Set default address
exports.setDefaultAddress = async (req, res) => {
	try {
		const { address_id } = req.body;

		// Reset all addresses to non-default
		await Address.updateMany({}, { is_default: false });

		// Set the selected address as default
		const address = await Address.findByIdAndUpdate(
			address_id,
			{ is_default: true },
			{ new: true }
		);

		res.status(200).json({ message: "Default address updated", address });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Something went wrong" });
	}
};
