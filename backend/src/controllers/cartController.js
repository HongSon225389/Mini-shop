const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc    Lấy giỏ hàng của user đang đăng nhập
// @route   GET /api/cart
// @access  Private (Chỉ user đã đăng nhập)
exports.getCart = async (req, res) => {
  try {
    // Tìm giỏ hàng theo ID của user, populate để lấy thêm tên, ảnh, giá và tồn kho của sản phẩm
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: "cartItems.product",
      select: "name image price countInStock",
    });

    // Nếu user chưa từng có giỏ hàng, trả về một giỏ hàng rỗng mặc định
    if (!cart) {
      return res.json({ user: req.user._id, cartItems: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// @desc    Thêm sản phẩm vào giỏ hàng / Cập nhật số lượng
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // 1. Kiểm tra xem sản phẩm có tồn tại và còn hàng không
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không tồn tại hoặc đã ngừng kinh doanh" });
    }
    if (product.countInStock < quantity) {
      return res
        .status(400)
        .json({ message: "Số lượng sản phẩm trong kho không đủ" });
    }

    // 2. Tìm giỏ hàng của user
    let cart = await Cart.findOne({ user: req.user._id });

    // Nếu user chưa có giỏ hàng, tạo mới
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        cartItems: [{ product: productId, quantity }],
      });
      await cart.save();
      return res.status(201).json(cart);
    }

    // 3. Nếu đã có giỏ hàng, kiểm tra xem sản phẩm đã nằm trong giỏ chưa
    const itemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex > -1) {
      // Sản phẩm ĐÃ CÓ trong giỏ -> Cộng dồn số lượng
      let newQuantity = cart.cartItems[itemIndex].quantity + quantity;

      // Đảm bảo không vượt quá số lượng tồn kho
      if (newQuantity > product.countInStock) {
        newQuantity = product.countInStock;
      }

      cart.cartItems[itemIndex].quantity = newQuantity;
    } else {
      // Sản phẩm CHƯA CÓ trong giỏ -> Thêm mới vào mảng
      cart.cartItems.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// @desc    Cập nhật chính xác số lượng 1 sản phẩm trong giỏ hàng (Dùng cho nút + / -)
// @route   PUT /api/cart/:productId
// @access  Private
exports.updateCartQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.productId;

    // 1. Kiểm tra số lượng hợp lệ (không cho phép giảm xuống âm hoặc 0)
    // Nếu bằng 0 thì Frontend nên gọi hàm removeFromCart thay thế
    if (quantity < 1) {
      return res.status(400).json({ message: "Số lượng phải lớn hơn 0" });
    }

    // 2. Kiểm tra tồn kho của sản phẩm
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không tồn tại hoặc đã ngừng kinh doanh" });
    }
    if (quantity > product.countInStock) {
      return res
        .status(400)
        .json({
          message: `Xin lỗi, sản phẩm này chỉ còn ${product.countInStock} cái trong kho`,
        });
    }

    // 3. Tìm giỏ hàng của user
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    }

    // 4. Tìm vị trí của sản phẩm trong giỏ hàng
    const itemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex > -1) {
      // Thay thế bằng số lượng chính xác mới gửi lên
      cart.cartItems[itemIndex].quantity = quantity;
      await cart.save();

      // Populate lại dữ liệu trả về cho Frontend hiển thị
      const updatedCart = await Cart.findById(cart._id).populate({
        path: "cartItems.product",
        select: "name image price countInStock",
      });

      res.status(200).json(updatedCart);
    } else {
      res.status(404).json({ message: "Sản phẩm không có trong giỏ hàng" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// @desc    Xóa 1 sản phẩm khỏi giỏ hàng
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    }

    // Lọc bỏ sản phẩm có ID trùng với productId gửi lên
    cart.cartItems = cart.cartItems.filter(
      (item) => item.product.toString() !== req.params.productId,
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};
