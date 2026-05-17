const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Khai báo đường dẫn và trỏ tới hàm Controller tương ứng
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

module.exports = router;
