const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

// @route   GET /api/statistics/overview
exports.getOverviewStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });

    const totalProducts = await Product.countDocuments({ isActive: true });

    const productsByCategory = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          categoryName: "$_id",
          count: 1,
        },
      },
    ]);

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

// @route   GET /api/statistics/monthly-revenue
exports.getMonthlyRevenue = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyData = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
          createdAt: { $gte: sixMonthsAgo },
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
