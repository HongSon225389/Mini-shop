const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const { protect } = require("../middlewares/auth");

router.get("/", protect, cartController.getCart);
router.post("/", protect, cartController.addToCart);
router.put("/:productId", protect, cartController.updateCartQuantity);
router.delete("/:productId", protect, cartController.removeFromCart);

module.exports = router;
