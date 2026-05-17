const express = require("express");
const router = express.Router();
const {
  updateUserProfile,
  // Bạn có thể import thêm các hàm login, register vào đây sau này
} = require("../controllers/userController");
const { protect } = require("../middlewares/auth");

// Đường dẫn đầy đủ: PUT /api/users/profile
// Sử dụng middleware 'protect' để bảo vệ route này
router.put("/profile", protect, updateUserProfile);

module.exports = router;
