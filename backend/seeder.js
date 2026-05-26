import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./src/models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminExists = await User.findOne({ email: "admin@shop.com" });

    if (adminExists) {
      console.log("Tài khoản Admin đã tồn tại!");
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    // Tạo tài khoản Admin
    const adminUser = new User({
      name: "Quản Trị Viên",
      email: "admin@shop.com",
      password: hashedPassword,
      phone: "0999999999",
      address: "Trụ sở chính Shop",
      role: "admin",
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
