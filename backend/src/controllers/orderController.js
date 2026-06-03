const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Không có sản phẩm nào để đặt hàng" });
    }

    const totalPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress: shippingAddress || req.user.address,
      phone: req.user.phone,
      totalPrice,
      status: "Pending",
    });

    const createdOrder = await order.save();

    const orderedProductIds = orderItems.map((item) => item.product.toString());

    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.cartItems = cart.cartItems.filter(
        (item) => !orderedProductIds.includes(item.product.toString()),
      );
      await cart.save();
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// @route   GET /api/orders/myorders
exports.getMyOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const count = await Order.countDocuments({ user: req.user._id });

    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      orders,
      page,
      pages: Math.ceil(count / limit),
      totalOrders: count,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// @route   GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const filter = req.query.status ? { status: req.query.status } : {};

    const count = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      orders,
      page,
      pages: Math.ceil(count / limit),
      totalOrders: count,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    if (
      req.user.role === "admin" ||
      order.user._id.toString() === req.user._id.toString()
    ) {
      res.json(order);
    } else {
      res.status(403).json({ message: "Không có quyền xem đơn hàng này" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    if (
      req.user.role !== "admin" &&
      status === "Cancelled" &&
      order.status !== "Pending"
    ) {
      return res
        .status(400)
        .json({ message: "Đơn hàng đã được duyệt, bạn không thể tự hủy." });
    }
    if (order.status === "Pending" && status === "Processing") {
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.countInStock -= item.quantity;
          if (product.countInStock < 0) product.countInStock = 0;
          await product.save();
        }
      }
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// @route   GET /api/orders/my-stats
exports.getUserOrderStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const statsArray = await Order.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusStats = {
      Pending: 0,
      Processing: 0,
      Delivered: 0,
      Cancelled: 0,
    };

    let totalSpent = 0;
    let totalOrders = 0;

    statsArray.forEach((item) => {
      statusStats[item._id] = item.count;
      totalOrders += item.count;
    });

    const totalSpentData = await Order.aggregate([
      { $match: { user: userId, status: "Delivered" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    totalSpent = totalSpentData.length > 0 ? totalSpentData[0].total : 0;

    res.json({
      totalOrders,
      totalSpent,
      statusStats,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};
