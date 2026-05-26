const express = require("express");
const router = express.Router();

const statisticController = require("../controllers/statisticController");
const { protect, admin } = require("../middlewares/auth");

router.get("/overview", protect, admin, statisticController.getOverviewStats);
router.get(
  "/monthly-revenue",
  protect,
  admin,
  statisticController.getMonthlyRevenue,
);

module.exports = router;
