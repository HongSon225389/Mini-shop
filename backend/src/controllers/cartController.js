const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @route   GET /api/cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: "cartItems.product",
      select: "name image price countInStock",
    });

    if (!cart) {
      return res.json({ user: req.user._id, cartItems: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// @route   POST /api/cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

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

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        cartItems: [{ product: productId, quantity }],
      });
      await cart.save();
      return res.status(201).json(cart);
    }

    const itemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex > -1) {
      let newQuantity = cart.cartItems[itemIndex].quantity + quantity;

      if (newQuantity > product.countInStock) {
        newQuantity = product.countInStock;
      }

      cart.cartItems[itemIndex].quantity = newQuantity;
    } else {
      cart.cartItems.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// @route   PUT /api/cart/:productId
exports.updateCartQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.productId;

    if (quantity < 1) {
      return res.status(400).json({ message: "Số lượng phải lớn hơn 0" });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không tồn tại hoặc đã ngừng kinh doanh" });
    }
    if (quantity > product.countInStock) {
      return res.status(400).json({
        message: `Xin lỗi, sản phẩm này chỉ còn ${product.countInStock} cái trong kho`,
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    }

    const itemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex > -1) {
      cart.cartItems[itemIndex].quantity = quantity;
      await cart.save();

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

// @route   DELETE /api/cart/:productId
exports.removeFromCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    }

    cart.cartItems = cart.cartItems.filter(
      (item) => item.product.toString() !== req.params.productId,
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};
