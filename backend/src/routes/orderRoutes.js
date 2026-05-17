const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const { protect, admin } = require("../middlewares/auth");

// Route cho User
router.get("/my-stats", protect, orderController.getUserOrderStats);
router.post("/", protect, orderController.createOrder);
router.get("/myorders", protect, orderController.getMyOrders);

// Route cho Admin
router.get("/", protect, admin, orderController.getAllOrders);

// Lấy chi tiết đơn hàng (Cần đặt dưới /myorders để tránh bị trùng route)
router.get("/:id", protect, orderController.getOrderById);

// Admin cập nhật trạng thái
router.put("/:id/status", protect, admin, orderController.updateOrderStatus);

module.exports = router;
