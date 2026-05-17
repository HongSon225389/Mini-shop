const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// Hàm bổ trợ tạo Token đã tạo ở utils
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: "30d", // Token có hạn trong 30 ngày
//   });
// };

// @desc    Đăng ký người dùng mới
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // 1. Kiểm tra xem email đã được đăng ký chưa
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email này đã được sử dụng!" });
    }

    // 2. Mã hóa mật khẩu (Hashing)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Tạo tài khoản mới vào Database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone, // Thông tin mặc định khi thanh toán
      address, // Thông tin mặc định khi thanh toán
    });

    // 4. Trả kết quả về cho Frontend (Kèm theo Token)
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Dữ liệu người dùng không hợp lệ" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// @desc    Đăng nhập & Trả về Token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Tìm user theo email
    const user = await User.findOne({ email });

    // 2. Kiểm tra mật khẩu (So sánh password nhập vào với hash trong DB)
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Email hoặc mật khẩu không chính xác" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

module.exports = { registerUser, loginUser };
