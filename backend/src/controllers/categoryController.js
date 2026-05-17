const Category = require("../models/Category");
const slugify = require("slugify");

// @desc    Lấy danh sách tất cả danh mục
// @route   GET /api/categories
// @access  Public (Ai cũng xem được để lọc sản phẩm)
exports.getCategories = async (req, res) => {
  try {
    // Nếu truyền limit=0 hoặc không truyền thì mặc định lấy tất cả (rất hữu ích khi load menu)
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const count = await Category.countDocuments();

    // Khởi tạo query
    const categoriesQuery = Category.find({}).sort({ createdAt: -1 }); // Mới tạo xếp trước

    // Chỉ áp dụng phân trang nếu limit > 0
    if (limit > 0) {
      categoriesQuery.skip(skip).limit(limit);
    }

    const categories = await categoriesQuery;

    res.json({
      categories,
      page,
      pages: limit > 0 ? Math.ceil(count / limit) : 1,
      totalCategories: count,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// @desc    Tạo danh mục mới
// @route   POST /api/categories
// @access  Private/Admin (Chỉ Admin mới được tạo)
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Vui lòng nhập tên danh mục" });
    }

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: "Danh mục này đã tồn tại" });
    }

    const category = await Category.create({
      name,
      slug: slugify(name, { lower: true, locale: "vi" }), // Tự động tạo slug tiếng Việt
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// @desc    Cập nhật danh mục
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findById(req.params.id);

    if (category) {
      category.name = name || category.name;
      if (name) {
        category.slug = slugify(name, { lower: true, locale: "vi" });
      }

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// @desc    Xóa danh mục
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      await category.deleteOne();
      res.json({ message: "Đã xóa danh mục thành công" });
    } else {
      res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};
