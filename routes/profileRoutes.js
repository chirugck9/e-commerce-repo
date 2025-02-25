const express = require("express");
const { saveProfile } = require("../controllers/profileController");
const { verifyToken } = require("../middlewares/authMiddleware")

const router = express.Router();

router.post("/", verifyToken, saveProfile);


module.exports = router;
