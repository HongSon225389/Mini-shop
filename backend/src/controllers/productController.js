const Product = require("../models/Product");
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
// @desc    Lấy danh sách tất cả sản phẩm
// @route   GET /api/products
// @access  Public
// @desc    Lấy danh sách tất cả sản phẩm (Tìm kiếm, Phân trang & Sắp xếp)
// @route   GET /api/products?keyword=abc&page=1&limit=10
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    // 1. Filter Theo Tên
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    // 2. Filter Theo Giá
    let priceFilter = {};
    if (req.query.minPrice || req.query.maxPrice) {
      priceFilter.price = {};
      if (req.query.minPrice)
        priceFilter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice)
        priceFilter.price.$lte = Number(req.query.maxPrice);
    }

    const filter = { ...keyword, ...priceFilter, isActive: true };

    // 3. Logic Sắp Xếp
    let sortQuery = { createdAt: -1 }; // Mặc định mới nhất
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
// exports.getProducts = async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 10;
//     const page = parseInt(req.query.page) || 1;

//     // Tìm kiếm theo tên
//     const keyword = req.query.keyword
//       ? { name: { $regex: req.query.keyword, $options: "i" } }
//       : {};

//     const filter = { ...keyword, isActive: true };

//     // --- LOGIC SẮP XẾP ---
//     let sortQuery = { createdAt: -1 }; // Mặc định: Mới nhất xếp trước
//     if (req.query.sort) {
//       if (req.query.sort === "price_asc") sortQuery = { price: 1 }; // Giá tăng dần
//       if (req.query.sort === "price_desc") sortQuery = { price: -1 }; // Giá giảm dần
//       if (req.query.sort === "name_asc") sortQuery = { name: 1 }; // Tên A-Z
//       if (req.query.sort === "name_desc") sortQuery = { name: -1 }; // Tên Z-A
//     }

//     const count = await Product.countDocuments(filter);

//     const products = await Product.find(filter)
//       .populate("category", "name slug")
//       .sort(sortQuery) // Áp dụng sắp xếp
//       .skip((page - 1) * limit)
//       .limit(limit);

//     res.json({
//       products,
//       page,
//       pages: Math.ceil(count / limit),
//       totalProducts: count,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Lỗi server: " + error.message });
//   }
// };

// @desc    Lấy chi tiết 1 sản phẩm theo ID
// @route   GET /api/products/:id
// @access  Public (Nhưng áp dụng chặn nếu sản phẩm bị ẩn)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // XỬ LÝ KHI SẢN PHẨM BỊ ẨN (isActive === false)
    if (product.isActive === false) {
      let isAdmin = false;

      // Kiểm tra xem người đang yêu cầu có phải là Admin hay không (bằng cách giải mã token nếu có)
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
          // Token lỗi hoặc hết hạn thì mặc định không phải admin, không cần crash server
          isAdmin = false;
        }
      }

      // Nếu KHÔNG PHẢI ADMIN thì chặn đứng, không trả về bất cứ dữ liệu nào
      if (!isAdmin) {
        return res.status(404).json({
          message:
            "Sản phẩm này đã ngừng kinh doanh hoặc tạm thời bị ẩn bởi Quản trị viên.",
        });
      }
    }

    // Nếu sản phẩm active HOẶC người xem là Admin thì trả về toàn bộ dữ liệu (bao gồm cả mảng reviews)
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// @desc    Admin thêm sản phẩm mới
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, countInStock, brand } =
      req.body;

    // 1. Kiểm tra các trường bắt buộc không được để trống
    if (!name || !description || !price || !image || !category) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ: Tên, Mô tả, Giá, Ảnh và Danh mục!",
      });
    }

    // 2. Kiểm tra tính hợp lệ của dữ liệu số
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
      user: req.user._id, // Luôn gắn ID admin tạo sản phẩm
      name,
      description,
      price,
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
// exports.createProduct = async (req, res) => {
//   try {
//     const { name, description, price, image, category, countInStock } =
//       req.body;

//     const product = new Product({
//       name,
//       description,
//       price,
//       image,
//       category,
//       countInStock,
//     });

//     const createdProduct = await product.save();
//     res.status(201).json(createdProduct);
//   } catch (error) {
//     res.status(500).json({ message: "Lỗi server: " + error.message });
//   }
// };

// @desc    Admin cập nhật sản phẩm
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, countInStock } =
      req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
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

// @desc    Admin xóa mềm sản phẩm
// @route   DELETE /api/products/:id
// @access  Private/Admin
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

// @desc    Tạo đánh giá & bình luận cho sản phẩm
// @route   POST /api/products/:id/reviews
// @access  Private (Chỉ user đã đăng nhập VÀ đã mua hàng mới được rate)
exports.createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    // 1. TÌM SẢN PHẨM
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // 2. KIỂM TRA ĐIỀU KIỆN: User đã mua sản phẩm này và đơn hàng đã "Delivered" chưa?
    // Tìm trong bảng Order xem có đơn nào của User này, trạng thái Delivered, và trong mảng orderItems có chứa ID sản phẩm này không.
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

    // 3. KIỂM TRA TRÙNG LẶP: Đã đánh giá rồi thì không cho đánh giá lại
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString(),
    );

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "Bạn đã đánh giá sản phẩm này rồi" });
    }

    // 4. TẠO REVIEW MỚI
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    // Thêm review vào mảng reviews của sản phẩm
    product.reviews.push(review);

    // 5. CẬP NHẬT LẠI ĐIỂM SỐ (Rating & NumReviews)
    product.numReviews = product.reviews.length;

    // Tính điểm trung bình: Tổng các số sao / Tổng số lượng đánh giá
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Đã thêm đánh giá thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};
