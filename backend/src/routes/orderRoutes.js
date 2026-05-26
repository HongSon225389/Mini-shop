const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const { protect, admin } = require("../middlewares/auth");

router.get("/my-stats", protect, orderController.getUserOrderStats);
router.post("/", protect, orderController.createOrder);
router.get("/myorders", protect, orderController.getMyOrders);
router.get("/", protect, admin, orderController.getAllOrders);
router.get("/:id", protect, orderController.getOrderById);
router.put("/:id/status", protect, admin, orderController.updateOrderStatus);

module.exports = router;
