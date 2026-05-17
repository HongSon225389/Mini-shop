const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 1. Middleware kiểm tra người dùng đã đăng nhập chưa (Xác thực - Authentication)
const protect = async (req, res, next) => {
  let token;

  // Kiểm tra xem header authorization có tồn tại và bắt đầu bằng chữ 'Bearer' không
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Tách chữ 'Bearer' và lấy ra token thật sự
      token = req.headers.authorization.split(" ")[1];

      // Giải mã token bằng chuỗi bí mật JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm user trong database bằng ID đã giải mã, gắn vào req.user
      // (.select('-password') để không lấy kèm mật khẩu nhằm bảo mật)
      req.user = await User.findById(decoded.id).select("-password");

      // Cho phép đi tiếp vào Controller
      next();
    } catch (error) {
      console.error("Lỗi xác thực token:", error.message);
      res.status(401).json({
        message: "Không có quyền truy cập, token không hợp lệ hoặc đã hết hạn",
      });
    }
  }

  // Nếu không tìm thấy token nào trong header
  if (!token) {
    res
      .status(401)
      .json({ message: "Không có quyền truy cập, không tìm thấy token" });
  }
};

// 2. Middleware kiểm tra quyền Admin (Phân quyền - Authorization)
// (Lưu ý: Middleware này LUÔN PHẢI ĐẶT SAU middleware `protect` ở trên)
const admin = (req, res, next) => {
  // Kiểm tra xem req.user đã được gán từ hàm protect chưa và role có phải admin không
  if (req.user && req.user.role === "admin") {
    next(); // Đúng admin thì cho qua
  } else {
    res.status(403).json({
      message: "Từ chối truy cập, yêu cầu quyền quản trị viên (Admin)",
    });
  }
};

module.exports = { protect, admin };
