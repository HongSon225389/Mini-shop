const Product = require("../models/Product");
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
// @route   GET /api/products
// @route   GET /api/products?keyword=abc&page=1&limit=10
exports.getProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    let priceFilter = {};
    if (req.query.minPrice || req.query.maxPrice) {
      priceFilter.price = {};
      if (req.query.minPrice)
        priceFilter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice)
        priceFilter.price.$lte = Number(req.query.maxPrice);
    }
    const categoryFilter = req.query.category
      ? { category: req.query.category }
      : {};

    const filter = {
      ...keyword,
      ...priceFilter,
      ...categoryFilter,
      isActive: true,
    };

    let sortQuery = { createdAt: -1 };
    if (req.query.sort) {
      const sortType = req.query.sort;
      if (sortType === "price_asc") sortQuery = { price: 1 };
      else if (sortType === "price_desc") sortQuery = { price: -1 };
      else if (sortType === "latest") sortQuery = { createdAt: -1 };
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      products,
      page,
      pages: Math.ceil(count / limit),
      totalProducts: count,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    if (product.isActive === false) {
      let isAdmin = false;

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        try {
          const token = req.headers.authorization.split(" ")[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decoded.id);
          if (user && user.role === "admin") {
            isAdmin = true;
          }
        } catch (tokenError) {
          isAdmin = false;
        }
      }

      if (!isAdmin) {
        return res.status(404).json({
          message:
            "Sản phẩm này đã ngừng kinh doanh hoặc tạm thời bị ẩn bởi Quản trị viên.",
        });
      }
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// @route   POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      image,
      category,
      countInStock,
      brand,
    } = req.body;

    if (!name || !description || !price || !image || !category) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ: Tên, Mô tả, Giá, Ảnh và Danh mục!",
      });
    }

    if (Number(price) <= 0) {
      return res
        .status(400)
        .json({ message: "Giá bán phải là số dương lớn hơn 0" });
    }

    if (Number(countInStock) < 0) {
      return res
        .status(400)
        .json({ message: "Số lượng tồn kho không được là số âm" });
    }

    const product = new Product({
      user: req.user._id,
      name,
      description,
      price,
      originalPrice: originalPrice || 0,
      image,
      category,
      countInStock: countInStock || 0,
      brand: brand || "No Brand",
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      image,
      category,
      countInStock,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.originalPrice = originalPrice || 0;
      product.image = image || product.image;
      product.category = category || product.category;
      product.countInStock = countInStock || product.countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.isActive = false;
      await product.save();
      res.json({ message: "Đã đưa sản phẩm vào thùng rác (Xóa mềm)" });
    } else {
      res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// @route   POST /api/products/:id/reviews
exports.createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    const hasBought = await Order.findOne({
      user: req.user._id,
      status: "Delivered",
      "orderItems.product": productId,
    });

    if (!hasBought) {
      return res.status(400).json({
        message:
          "Bạn phải mua và nhận sản phẩm này thành công thì mới được đánh giá!",
      });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString(),
    );

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "Bạn đã đánh giá sản phẩm này rồi" });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Đã thêm đánh giá thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};
