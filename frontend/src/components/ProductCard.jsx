// frontend/src/components/ProductCard.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch(); // Khởi tạo dispatch

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Gọi Redux để lưu sản phẩm vào giỏ, mặc định số lượng (qty) là 1
    dispatch(addToCart({ ...product, qty: 1 }));
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  // Hàm xử lý đường dẫn ảnh (nếu là link web ngoài thì giữ nguyên, nếu là upload thì thêm localhost)
  const imageUrl = product.image.startsWith("/uploads")
    ? `http://localhost:5000${product.image}`
    : product.image;

  return (
    <Link
      to={`/product/${product._id}`}
      className="group block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="w-full aspect-square overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center mt-1 mb-2 text-xs text-amber-500">
          <span>⭐ {product.rating?.toFixed(1) || "0.0"}</span>
          <span className="text-gray-400 ml-1">
            ({product.numReviews} đánh giá)
          </span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-base font-bold text-red-600">
            {product.price?.toLocaleString("vi-VN")} đ
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className={`p-2 rounded-full transition-colors ${
              product.countInStock === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
            }`}
            title={product.countInStock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
