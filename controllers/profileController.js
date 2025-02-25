const User = require("../models/user.model");
const Profile = require("../models/profile.model");
const admin = require("../config/firebase");

exports.saveProfile = async (req, res) => {
	const { profileData } = req.body;

	try {
		// Get the token from Authorization header
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ error: "No token provided" });
		}

		const idToken = authHeader.split("Bearer ")[1];

		// Verify the token
		const decodedToken = await admin.auth().verifyIdToken(idToken);
		const userId = decodedToken.uid;

		console.log(decodedToken, "decoded token");

		const profile = new Profile({ userId, ...profileData });
		await profile.save();

		return res.status(201).json({
			message: "Profile saved successfully.",
			profile,
		});
	} catch (error) {
		console.error("Error: ", error);
		if (error.code === "auth/id-token-expired") {
			return res.status(401).json({ error: "Token expired" });
		}
		res.status(400).json({ error: "Invalid token or data" });
	}
};
