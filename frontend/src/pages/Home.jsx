import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import ProductCard from "../components/ProductCard";
import { Zap, Gem, Flame, ArrowRight } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const quickCategories = [
    { name: "Điện thoại", icon: "📱", slug: "Smartphone" },
    { name: "Laptop", icon: "💻", slug: "Laptop" },
    { name: "Bàn phím", icon: "⌨️", slug: "Keyboard" },
    { name: "Chuột Gaming", icon: "🖱️", slug: "Mouse" },
    { name: "Màn hình", icon: "🖥️", slug: "Monitor" },
    { name: "Tai nghe", icon: "🎧", slug: "Audio" },
  ];
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
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

  const latestProducts = products.slice(0, 4);

  const topPricedProducts = [...products]
    .sort((a, b) => b.price - a.price)
    .slice(0, 4);

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
      <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-200/50 my-6">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-blue-400/20 blur-2xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-center justify-between p-10 md:p-16 relative z-10 min-h-[320px]">
          <div className="text-white max-w-xl text-center md:text-left mb-8 md:mb-0">
            <span className="inline-block py-1 px-4 rounded-full bg-white/20 text-xs font-black tracking-widest uppercase mb-5 border border-white/30 backdrop-blur-md shadow-sm">
              🔥 Siêu sale mùa hè
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-5 leading-[1.2] tracking-tight">
              Săn Sale Công Nghệ <br />
              <span className="text-yellow-300">Không Lo Về Giá</span>
            </h1>
            <p className="text-blue-100 mb-8 text-sm md:text-base font-medium max-w-md mx-auto md:mx-0 leading-relaxed">
              Khám phá hàng ngàn sản phẩm chính hãng với mức ưu đãi tốt nhất thị
              trường. Miễn phí vận chuyển toàn quốc!
            </p>
            <button className="bg-white text-blue-700 font-black py-3.5 px-8 rounded-full shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all flex items-center justify-center mx-auto md:mx-0 group active:scale-95">
              MUA SẮM NGAY
              <span className="ml-2 group-hover:translate-x-1.5 transition-transform duration-300">
                →
              </span>
            </button>
          </div>

          <div className="hidden md:flex flex-1 justify-end items-center pr-8">
            <div className="w-56 h-56 bg-gradient-to-tr from-white/20 to-white/5 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl animate-[bounce_4s_ease-in-out_infinite]">
              <span className="text-white/80 font-bold text-center text-sm px-4">
                <img src="/public/baner.png" alt="Banner" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="my-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-gray-800 tracking-tight flex items-center">
            <span className="w-1 h-6 bg-blue-600 rounded-full mr-2.5 inline-block"></span>
            Danh mục nổi bật
          </h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {quickCategories.map((cat, index) => (
            <button
              key={index}
              onClick={() => navigate(`/shop?category=${cat.slug}`)}
              className="flex flex-col items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all group duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-2xl mb-3 group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300 shadow-inner">
                {cat.icon}
              </div>

              <span className="text-xs font-bold text-gray-600 group-hover:text-blue-600 transition-colors text-center truncate w-full">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-16">
        <section>
          <div className="relative flex items-center justify-center mb-10 mt-16">
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 uppercase tracking-tight flex items-center">
              <Zap className="mr-3 text-blue-600" size={32} />
              Sản phẩm mới nhất
            </h2>

            <Link
              to="/shop"
              className="absolute right-0 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors hidden md:flex items-center"
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

        <section>
          <div className="relative flex items-center justify-center mb-10 mt-16">
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 uppercase tracking-tight flex items-center">
              <Flame className="mr-3 text-red-500 fill-red-500" size={32} />
              Sản phẩm bán chạy
            </h2>

            <Link
              to="/shop?sort=bestseller"
              className="absolute right-0 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors hidden md:flex items-center"
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

        <section>
          <div className="relative flex items-center justify-center mb-10 mt-16">
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 uppercase tracking-tight flex items-center">
              <Gem className="mr-3 text-yellow-500" size={32} />
              Sản phẩm nổi bật
            </h2>

            <Link
              to="/shop?sort=popular"
              className="absolute right-0 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors hidden md:flex items-center"
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
