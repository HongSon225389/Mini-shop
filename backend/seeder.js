import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./src/models/User.js";

// Load biến môi trường (chứa link MongoDB)
dotenv.config();

const createAdmin = async () => {
  try {
    // Kết nối Database
    await mongoose.connect(process.env.MONGO_URI);

    // Kiểm tra xem đã có admin chưa
    const adminExists = await User.findOne({ email: "admin@shop.com" });

    if (adminExists) {
      console.log("Tài khoản Admin đã tồn tại!");
      process.exit();
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt); // Mật khẩu mặc định là 123456

    // Tạo tài khoản Admin
    const adminUser = new User({
      name: "Quản Trị Viên",
      email: "admin@shop.com",
      password: hashedPassword,
      phone: "0999999999",
      address: "Trụ sở chính Shop",
      role: "admin", // Cố định role là admin
    });

    await adminUser.save();
    console.log("Đã tạo tài khoản Admin thành công!");
    process.exit();
  } catch (error) {
    console.error(`Lỗi: ${error.message}`);
    process.exit(1);
  }
};

createAdmin();
