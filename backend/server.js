const path = require("path");
const uploadRoutes = require("./src/routes/uploadRoutes");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const productRoutes = require("./src/routes/productRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const statisticRoutes = require("./src/routes/statisticRoutes");
const userRoutes = require("./src/routes/userRoutes");

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// --- ROUTES ---
// Gắn route xác thực vào đường dẫn /api/auth
app.use("/api/auth", authRoutes);

// Gắn route xác thực vào đường dẫn /api/categories
app.use("/api/categories", categoryRoutes);
// Gắn route xác thực vào đường dẫn /api/products
app.use("/api/products", productRoutes);
// Gắn route xác thực vào đường dẫn /api/carts
app.use("/api/carts", cartRoutes);
// Gắn route xác thực vào đường dẫn /api/orders
app.use("/api/orders", orderRoutes);
// Gắn route thống kê cho Admin
app.use("/api/statistics", statisticRoutes);
// Gắn route xác thực vào đường dẫn /api/upload
app.use("/api/upload", uploadRoutes);

app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
  res.send("API Backend Shop Mini Đang Chạy Mượt Mà...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
});
