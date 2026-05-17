const User = require("../models/User");

// @desc    Cập nhật thông tin hồ sơ User
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    // Lấy user từ req.user do middleware 'protect' cung cấp sau khi giải mã token
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Cập nhật các trường thông tin nếu có dữ liệu mới từ client gửi lên
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    // Nếu người dùng muốn đổi mật khẩu thì mới cập nhật trường password
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    // Lấy lại token từ header authorization để trả về đồng bộ cho client
    const token = req.headers.authorization.split(" ")[1];

    // Trả về dữ liệu mới để frontend cập nhật lại Redux State / LocalStorage
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      role: updatedUser.role,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};
