const express = require("express");
const router = express.Router();

const statisticController = require("../controllers/statisticController");
const { protect, admin } = require("../middlewares/auth");

// Chỉ Admin mới được xem thống kê
router.get("/overview", protect, admin, statisticController.getOverviewStats);
router.get(
  "/monthly-revenue",
  protect,
  admin,
  statisticController.getMonthlyRevenue,
);

module.exports = router;
