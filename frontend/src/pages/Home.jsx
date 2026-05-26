import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import ProductCard from "../components/ProductCard";
import { Zap, Gem, Flame, ArrowRight } from "lucide-react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Lấy số lượng lớn sản phẩm để có đủ data phân loại
        const { data } = await axiosInstance.get("/products?limit=50");
        setProducts(data.products || data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 1. SẢN PHẨM MỚI NHẤT: Lấy 4 sản phẩm đầu tiên (Backend thường đã sort mới nhất)
  const latestProducts = products.slice(0, 4);

  // 2. SẢN PHẨM NỔI BẬT: Sắp xếp theo giá (price) giảm dần
  const topPricedProducts = [...products]
    .sort((a, b) => b.price - a.price)
    .slice(0, 4);

  // 3. SẢN PHẨM BÁN CHẠY: Sắp xếp theo số lượng đánh giá (numReviews) giảm dần
  const bestSellingProducts = [...products]
    .sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0))
    .slice(0, 4);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* BANNER TRANG CHỦ */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white mb-12">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Nâng tầm trải nghiệm công nghệ
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl">
            Khám phá các sản phẩm công nghệ đỉnh cao, từ smartphone, laptop cho
            đến phụ kiện gaming chuyên nghiệp.
          </p>
          <Link
            to="/shop"
            className="bg-white text-blue-600 font-bold px-8 py-3.5 rounded-full hover:bg-gray-100 transition-colors shadow-lg flex items-center"
          >
            Mua sắm ngay <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-16">
        {/* SECTION 1: SẢN PHẨM MỚI NHẤT */}
        <section>
          <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-3">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Zap className="mr-2 text-blue-600" size={28} /> Sản phẩm mới nhất
            </h2>
            <Link
              to="/shop"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
            >
              Xem tất cả <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {latestProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* SECTION 2: SẢN PHẨM BÁN CHẠY */}
        <section>
          <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-3">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Flame className="mr-2 text-red-500" size={28} /> Sản phẩm bán
              chạy
            </h2>
            <Link
              to="/shop"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
            >
              Xem tất cả <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestSellingProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* SECTION 3: SẢN PHẨM NỔI BẬT (GIÁ TRỊ CAO) */}
        <section>
          <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-3">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Gem className="mr-2 text-amber-500" size={28} /> Sản phẩm nổi bật
            </h2>
            <Link
              to="/shop"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
            >
              Xem tất cả <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {topPricedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
