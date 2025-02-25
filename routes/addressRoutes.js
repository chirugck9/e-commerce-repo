const express = require("express");
const {
	addAddress,
	getAddresses,
	setDefaultAddress,
} = require("../controllers/addressController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", verifyToken, addAddress);
router.get("/get/:user_id", verifyToken, getAddresses);
router.put("/set-default", verifyToken, setDefaultAddress);

module.exports = router;
