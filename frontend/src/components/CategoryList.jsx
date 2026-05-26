import React from "react";
import { Link } from "react-router-dom";
import {
  Smartphone,
  Laptop,
  Keyboard,
  Mouse,
  Headphones,
  ArrowRight,
  PlusCircle,
} from "lucide-react";

const CategoryList = () => {
  // 1. Dữ liệu các danh mục (đồng bộ slug tiếng Anh với Database nhé)
  const categories = [
    {
      name: "Smartphone",
      icon: Smartphone,
      count: "10 sản phẩm",
      slug: "Smartphone",
    },
    { name: "Laptop", icon: Laptop, count: "10 sản phẩm", slug: "Laptop" },
    {
      name: "Bàn phím",
      icon: Keyboard,
      count: "10 sản phẩm",
      slug: "Keyboard",
    },
    {
      name: "Chuột Gaming",
      icon: Mouse,
      count: "10 sản phẩm",
      slug: "Mouse",
    },
    {
      name: "Tai nghe",
      icon: Headphones,
      count: "10 sản phẩm",
      slug: "Audio",
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 mt-12 mb-10">
      {/* Khung chứa chính: Thẻ card bo góc, viền nhẹ */}
      <div className="w-full bg-white rounded-[2rem] border border-gray-100 p-8 shadow-inner relative overflow-hidden">
        {/* --- PHẦN TIÊU ĐỀ KHỐI --- */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <h2 className="text-2xl md:text-3xl font-black text-gray-800 uppercase tracking-tight">
            Danh Mục
          </h2>
          {/* Nút Xem thêm ở trên góc (Tùy chọn) */}
          <Link
            to="/shop"
            className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1.5"
          >
            Quản lý <PlusCircle size={16} />
          </Link>
        </div>

        {/* --- DANH SÁCH CÁC MỤC (HÀNG DỌC) --- */}
        <div className="space-y-1">
          {categories.map((category, index) => {
            // Lấy Component Icon từ object dữ liệu
            const Icon = category.icon;

            return (
              <div
                key={index}
                className="flex items-center justify-between py-5 border-b border-gray-100 last:border-b-0 group"
              >
                {/* Bên trái: Icon & Tên + Số lượng */}
                <div className="flex items-center gap-4">
                  {/* Khung tròn chứa Icon */}
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:scale-105 shadow-sm border border-blue-100/50">
                    <Icon size={24} strokeWidth={2.5} />
                  </div>
                  {/* Tên và Số lượng sản phẩm (Số lượng này bạn có thể map từ Database sau) */}
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-700 text-base group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </span>
                    <span className="text-xs text-gray-400 font-medium opacity-80 mt-0.5">
                      --- {category.count} ---
                    </span>
                  </div>
                </div>

                {/* Bên phải: Nút hành động */}
                <Link
                  to={`/shop?category=${category.slug}`}
                  className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1.5 opacity-80 group-hover:opacity-100"
                >
                  Xem Thêm{" "}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            );
          })}
        </div>
        {/* --- HẾT DANH SÁCH --- */}

        {/* --- NÚT XEM THÊM CHÍNH Ở DƯỚI CÙNG (PILL-SHAPED) --- */}
        <div className="mt-10 text-center">
          <Link
            to="/shop"
            className="w-full inline-block bg-blue-600 text-white font-black py-4 px-10 rounded-full uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-md active:scale-95 transform"
          >
            XEM THÊM
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
