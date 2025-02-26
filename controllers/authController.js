const admin = require("../config/firebase");
const User = require("../models/user.model");
const firebase = require("firebase/compat/app");
require("firebase/compat/auth");

// Initialize Firebase Client SDK (for password verification)
const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID,
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

exports.signup = async (req, res) => {
	try {
		const { email, password, full_name, phone_number, role, is_active } =
			req.body;

		if (!full_name || !email || !password || !role || !is_active) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		const allowedRoles = ["user", "admin"];
		if (!allowedRoles.includes(role)) {
			return res
				.status(400)
				.json({ error: 'Invalid role. Allowed roles are "user" and "admin".' });
		}

		const firebaseUser = await admin.auth().createUser({
			email,
			password,
		});

		await admin.auth().setCustomUserClaims(firebaseUser.uid, { role });

		const user = new User({
			email,
			firebaseUid: firebaseUser.uid,
			full_name,
			phone_number,
			role,
			is_active,
		});

		await user.save();

		return res.status(201).json({
			message: "User created successfully",
			user: { uid: firebaseUser.uid, email, role },
		});
	} catch (error) {
		console.error(error);
		return res
			.status(400)
			.json({ error: "Error creating user", message: error.message });
	}
};

exports.login = async (req, res) => {
	const { email, password } = req.body;

	try {
		// Fetch the user by email using Firebase Admin SDK
		const userRecord = await admin.auth().getUserByEmail(email);

		// Verify the password using Firebase Client SDK
		const userCredential = await firebase
			.auth()
			.signInWithEmailAndPassword(email, password);

		//  Generate a Firebase ID token
		const idToken = await userCredential.user.getIdToken();
		// Fetch custom claims (role)
		const { customClaims } = await admin.auth().getUser(userRecord.uid);
		const role = customClaims?.role || "user";

		return res
			.status(200)
			.json({ message: "Logged in successfully.", idToken, role });
	} catch (error) {
		console.error("Error:", error);
		return res
			.status(400)
			.json({ error: "Authentication failed", message: error.message });
	}
};
