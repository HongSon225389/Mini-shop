// backend/src/controllers/statisticController.js
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

// @desc    Lấy các con số thống kê tổng quan cho Admin Dashboard
// @route   GET /api/statistics/overview
// @access  Private/Admin
exports.getOverviewStats = async (req, res) => {
  try {
    // 1. TỔNG SỐ USER
    const totalUsers = await User.countDocuments({ role: "user" });

    // 2. TỔNG SỐ SẢN PHẨM (Dùng hàm này để đếm tuyệt đối an toàn)
    const totalProducts = await Product.countDocuments({ isActive: true });

    // 3. THỐNG KÊ SẢN PHẨM THEO DANH MỤC (Đã sửa cho category dạng String)
    const productsByCategory = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$category", // Nhóm lại theo chữ (VD: "Laptop")
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          categoryName: "$_id", // Lấy luôn _id làm tên danh mục
          count: 1,
        },
      },
    ]);

    // 4. THỐNG KÊ ĐƠN HÀNG THEO TRẠNG THÁI
    const ordersByStatusArray = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const ordersStatusCount = {
      Pending: 0,
      Processing: 0,
      Delivered: 0,
      Cancelled: 0,
    };

    let totalOrders = 0;

    ordersByStatusArray.forEach((item) => {
      ordersStatusCount[item._id] = item.count;
      totalOrders += item.count;
    });

    // 5. TỔNG DOANH THU (Chỉ tính đơn Delivered)
    const revenueData = await Order.aggregate([
      { $match: { status: "Delivered" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // 6. TRẢ KẾT QUẢ VỀ (Cấu trúc này khớp 100% với Frontend của bạn)
    res.json({
      totalUsers,
      totalRevenue,
      products: {
        total: totalProducts,
        byCategory: productsByCategory,
      },
      orders: {
        total: totalOrders,
        byStatus: ordersStatusCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// @desc    Thống kê doanh thu 6 tháng gần nhất
// @route   GET /api/statistics/monthly-revenue
// @access  Private/Admin
exports.getMonthlyRevenue = async (req, res) => {
  try {
    // 1. Tính toán thời điểm bắt đầu của 6 tháng trước
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // Lùi về 5 tháng trước + tháng hiện tại = 6 tháng
    sixMonthsAgo.setDate(1); // Lấy từ ngày mùng 1
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyData = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
          createdAt: { $gte: sixMonthsAgo }, // Lấy mọi đơn từ 6 tháng trước đến nay
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          revenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Format lại data cho Frontend dễ đọc
    const formattedData = monthlyData.map((item) => ({
      month: item._id.month,
      year: item._id.year,
      revenue: item.revenue,
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};
