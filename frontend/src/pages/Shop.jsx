import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import ProductCard from "../components/ProductCard";
import {
  ListFilter,
  Search,
  SlidersHorizontal,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy các tham số từ URL
  const keyword = searchParams.get("keyword") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const minPrice = searchParams.get("min") || "";
  const maxPrice = searchParams.get("max") || "";
  const sort = searchParams.get("sort") || "latest";
  const category = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [pages, setPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const priceRanges = [
    { label: "Tất cả mức giá", min: "", max: "" },
    { label: "Dưới 10 triệu", min: "0", max: "10000000" },
    { label: "10 - 20 triệu", min: "10000000", max: "20000000" },
    { label: "20 - 30 triệu", min: "20000000", max: "30000000" },
    { label: "Trên 30 triệu", min: "30000000", max: "999999999" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/products", {
          params: {
            keyword,
            page: currentPage,
            limit: 9, // Tăng lên 9 để khớp grid 3 cột
            minPrice,
            maxPrice,
            sort,
            category,
          },
        });
        setProducts(data.products);
        setPages(data.pages);
        setTotalProducts(data.totalProducts);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, currentPage, minPrice, maxPrice, sort, category]);

  const updateFilter = (newParams) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1"); // Luôn reset về trang 1 khi lọc
    Object.keys(newParams).forEach((key) => {
      if (newParams[key] === "") params.delete(key);
      else params.set(key, newParams[key]);
    });
    navigate(`/shop?${params.toString()}`);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR BỘ LỌC */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
              <ListFilter className="mr-2 text-blue-600" size={20} /> Bộ lọc sản
              phẩm
            </h2>

            <div className="mb-8">
              <label className="text-[11px] font-black uppercase text-gray-400 tracking-wider mb-4 block">
                Khoảng giá (VNĐ)
              </label>
              <div className="space-y-2">
                {priceRanges.map((range, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      updateFilter({ min: range.min, max: range.max })
                    }
                    className={`w-full text-left text-sm py-2.5 px-4 rounded-xl transition-all flex justify-between items-center group ${
                      minPrice === range.min && maxPrice === range.max
                        ? "bg-blue-600 text-white font-bold shadow-lg shadow-blue-100"
                        : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                    }`}
                  >
                    {range.label}
                    <ChevronRight
                      size={14}
                      className={
                        minPrice === range.min && maxPrice === range.max
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {(keyword || minPrice || sort !== "latest") && (
              <button
                onClick={() => navigate("/shop")}
                className="w-full py-2.5 text-xs font-bold text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition-colors"
              >
                Xóa tất cả bộ lọc
              </button>
            )}
          </div>
        </aside>

        {/* NỘI DUNG CHÍNH */}
        <main className="flex-1">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl shadow-sm border border-gray-50">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {keyword ? `Tìm kiếm: "${keyword}"` : "Cửa hàng sản phẩm"}
              </h1>
              <p className="text-gray-500 text-sm">
                Tìm thấy{" "}
                <span className="text-blue-600 font-bold">{totalProducts}</span>{" "}
                sản phẩm
              </p>
            </div>

            {/* DROPDOWN SẮP XẾP */}
            <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
              <SlidersHorizontal size={16} className="mr-2 text-blue-600" />
              <span className="mr-2 font-medium">Sắp xếp:</span>
              <select
                value={sort}
                onChange={(e) => updateFilter({ sort: e.target.value })}
                className="bg-transparent font-bold text-gray-800 focus:outline-none cursor-pointer"
              >
                <option value="latest">Mới nhất</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
              <Search size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500 text-lg font-medium">
                Không tìm thấy sản phẩm nào phù hợp.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {pages > 1 && (
                <div className="flex justify-center items-center mt-12 space-x-2">
                  {[...Array(pages).keys()].map((x) => (
                    <button
                      key={x + 1}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set("page", x + 1);
                        navigate(`/shop?${params.toString()}`);
                        window.scrollTo(0, 0);
                      }}
                      className={`w-10 h-10 rounded-xl font-bold transition-all ${
                        x + 1 === currentPage
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                          : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
                      }`}
                    >
                      {x + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
