import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";

const ProductCard = ({ product }) => {
  const hasDiscount = product.originalPrice > product.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  const isNew = product.createdAt
    ? (new Date() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24) <= 30
    : false;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 overflow-hidden relative flex flex-col h-full transform hover:-translate-y-1.5">
      <div className="absolute top-0 inset-x-0 z-10 p-3 flex items-center justify-between pointer-events-none">
        <div>
          {isNew && (
            <span className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md backdrop-blur-sm bg-blue-500/90 pointer-events-auto">
              Mới
            </span>
          )}
        </div>

        <div>
          {hasDiscount && (
            <span className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white text-[11px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md backdrop-blur-sm bg-red-500/90 pointer-events-auto">
              -{discountPercent}%
            </span>
          )}
        </div>
      </div>

      <Link
        to={`/product/${product._id}`}
        className="block relative overflow-hidden aspect-square bg-gray-50 flex items-center justify-center p-4"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800";
          }}
        />
      </Link>

      <div className="p-5 flex flex-col flex-1 bg-white relative z-10">
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
          {product.brand || "T1-SHOP"}
        </div>

        <Link to={`/product/${product._id}`}>
          <h3 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-relaxed">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center mb-4 mt-auto">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-bold text-gray-700 ml-1.5">
            {product.rating > 0 ? product.rating : "5.0"}
          </span>
          <span className="text-xs text-gray-400 font-medium ml-1">
            ({product.numReviews})
          </span>
        </div>

        <div className="flex items-end justify-between pt-3 border-t border-gray-50 mt-auto">
          <div className="flex flex-col">
            <div
              className={`font-black text-base tracking-tight ${hasDiscount ? "text-red-600" : "text-blue-600"}`}
            >
              {product.price.toLocaleString("vi-VN")}{" "}
              <span className="text-xs align-top underline">đ</span>
            </div>
            {hasDiscount && (
              <div className="text-[11px] text-gray-400 line-through font-medium mt-0.5">
                {product.originalPrice.toLocaleString("vi-VN")} đ
              </div>
            )}
          </div>

          <button
            className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 active:scale-90"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
