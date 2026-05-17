const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const { protect, admin } = require("../middlewares/auth");

// Public routes (Khách xem hàng)
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

//User route (Đánh Giá & Bình Luận)
router.post("/:id/reviews", protect, productController.createProductReview);

// Admin routes (Quản lý kho hàng)
router.post("/", protect, admin, productController.createProduct);
router.put("/:id", protect, admin, productController.updateProduct);
router.delete("/:id", protect, admin, productController.deleteProduct);

module.exports = router;
