const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Không có sản phẩm nào để đặt hàng" });
    }

    // Tính tổng tiền ở Backend để tránh việc user sửa code Frontend gửi sai giá
    const totalPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    // Tạo đơn hàng mới (SĐT lấy cứng từ req.user)
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress: shippingAddress || req.user.address, // Nếu không nhập, lấy mặc định
      phone: req.user.phone, // Luôn lấy từ profile, không tin tưởng client
      totalPrice,
      status: "Pending", // Mặc định là Chờ duyệt
    });

    const createdOrder = await order.save();

    // (Tùy chọn) Xóa các sản phẩm đã đặt khỏi Giỏ hàng của user
    // Lấy danh sách ID các sản phẩm vừa đặt
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

// @desc    Lấy danh sách đơn hàng của chính User đang đăng nhập
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const count = await Order.countDocuments({ user: req.user._id });

    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 }) // Mặc định luôn là đơn mới nhất ở trên cùng
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

// @desc    Admin lấy danh sách TẤT CẢ đơn hàng trên hệ thống
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    // Admin có thể muốn lọc: Lấy tất cả các đơn đang "Chờ duyệt" (?status=Pending)
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

// @desc    Lấy chi tiết 1 đơn hàng theo ID
// @route   GET /api/orders/:id
// @access  Private (User xem đơn của mình HOẶC Admin xem đơn của ai cũng được)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Kiểm tra quyền: Nếu là admin hoặc chính chủ đơn hàng thì mới được xem
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

// @desc    Admin cập nhật trạng thái đơn hàng (Duyệt đơn -> Trừ kho)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
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
    // LOGIC TRỪ TỒN KHO: Khi Admin đổi từ Pending sang Processing (Duyệt đơn)
    if (order.status === "Pending" && status === "Processing") {
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.countInStock -= item.quantity;
          // Ngăn số lượng bị âm nếu lỡ có lỗi
          if (product.countInStock < 0) product.countInStock = 0;
          await product.save();
        }
      }
    }

    // Cập nhật trạng thái mới
    order.status = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// @desc    User xem thống kê lịch sử mua hàng cá nhân
// @route   GET /api/orders/my-stats
// @access  Private
exports.getUserOrderStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Thống kê số lượng đơn hàng theo trạng thái của riêng User này
    const statsArray = await Order.aggregate([
      { $match: { user: userId } }, // Chỉ lọc đơn của chính chủ
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format lại cho đẹp
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

    // 2. Tính tổng tiền đã thanh toán (chỉ tính đơn đã giao thành công)
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
      statusStats, // Trả về để FE làm các badge (ví dụ: Chờ duyệt (3))
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};
