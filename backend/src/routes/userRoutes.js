const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middlewares/auth");

// /api/users/profile
router.put("/profile", protect, userController.updateUserProfile);

module.exports = router;
