// frontend/src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {
  TrendingUp,
  Package,
  ClipboardList,
  Users,
  ArrowRight,
  PieChart,
  Activity,
  BarChart3, // Thêm icon biểu đồ
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    ordersByStatus: { Pending: 0, Processing: 0, Delivered: 0, Cancelled: 0 },
    productsByCategory: [],
  });

  // STATE MỚI CHO BIỂU ĐỒ
  const [revenueChart, setRevenueChart] = useState([]);
  const [maxRevenue, setMaxRevenue] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo || userInfo.role !== "admin") {
      navigate("/");
    } else {
      fetchAdminStats();
    }
  }, [userInfo, navigate]);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      // Gọi 2 API cùng lúc để tối ưu tốc độ
      const [overviewRes, revenueRes] = await Promise.all([
        axiosInstance.get("/statistics/overview"),
        axiosInstance.get("/statistics/monthly-revenue"),
      ]);

      const data = overviewRes.data;
      const revData = revenueRes.data; // Array [{month, year, revenue}]

      setStats({
        totalRevenue: data.totalRevenue || 0,
        totalOrders: data.orders?.total || 0,
        totalProducts: data.products?.total || 0,
        totalUsers: data.totalUsers || 0,
        ordersByStatus: data.orders?.byStatus || {},
        productsByCategory: data.products?.byCategory || [],
      });

      // XỬ LÝ DỮ LIỆU BIỂU ĐỒ (Dựng mảng 6 tháng gần nhất)
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const processedRev = [];
      let maxRev = 0;

      for (let i = 5; i >= 0; i--) {
        let m = currentMonth - i;
        let y = currentYear;
        if (m <= 0) {
          m += 12;
          y -= 1;
        }

        const found = revData.find(
          (item) => item.month === m && item.year === y,
        );
        const rev = found ? found.revenue : 0;
        if (rev > maxRev) maxRev = rev;

        processedRev.push({
          monthLabel: `Tháng ${m}`,
          revenue: rev,
        });
      }

      // Đẩy trần biểu đồ lên 10% để cột cao nhất không bị chạm nóc
      setMaxRevenue(maxRev === 0 ? 100 : maxRev * 1.1);
      setRevenueChart(processedRev);
      setLoading(false);
    } catch (error) {
      console.log("Lỗi tải thống kê:", error);
      setLoading(false);
    }
  };

  const getPercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Thống kê doanh thu
      </h1>

      {/* 4 THẺ TỔNG QUAN GIỮ NGUYÊN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-1">
              Doanh thu
            </p>
            <h3 className="text-2xl font-bold text-gray-800">
              {loading
                ? "..."
                : `${stats.totalRevenue.toLocaleString("vi-VN")} đ`}
            </h3>
          </div>
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-1">
              Tổng đơn hàng
            </p>
            <h3 className="text-2xl font-bold text-gray-800">
              {loading ? "..." : stats.totalOrders}
            </h3>
          </div>
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <ClipboardList size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-1">
              Số chủng loại sản phẩm
            </p>
            <h3 className="text-2xl font-bold text-gray-800">
              {loading ? "..." : stats.totalProducts}
            </h3>
          </div>
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
            <Package size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-1">
              Khách hàng
            </p>
            <h3 className="text-2xl font-bold text-gray-800">
              {loading ? "..." : stats.totalUsers}
            </h3>
          </div>
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* BIỂU ĐỒ DOANH THU 6 THÁNG - MỚI THÊM */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-8 flex items-center">
          <BarChart3 className="mr-2 text-green-600" size={24} /> Biểu đồ Doanh
          thu (6 tháng gần nhất)
        </h2>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-400">
            Đang vẽ biểu đồ...
          </div>
        ) : (
          <div className="flex items-end h-64 gap-2 sm:gap-6 w-full px-2 border-b border-gray-100 pb-2">
            {revenueChart.map((item, index) => {
              const heightPercentage =
                maxRevenue === 0 ? 0 : (item.revenue / maxRevenue) * 100;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center justify-end h-full flex-1 group"
                >
                  {/* Tooltip hiển thị khi hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 bg-gray-800 text-white text-xs px-2 py-1.5 rounded-lg whitespace-nowrap pointer-events-none shadow-lg z-10">
                    {item.revenue.toLocaleString("vi-VN")} đ
                  </div>

                  {/* Thanh Bar (Cột biểu đồ) */}
                  <div className="w-full max-w-[50px] bg-gray-50 rounded-t-lg h-[80%] flex items-end relative overflow-hidden group-hover:bg-gray-100 transition-colors">
                    <div
                      className="w-full bg-green-500 rounded-t-lg transition-all duration-1000 ease-out group-hover:bg-green-400"
                      style={{ height: `${heightPercentage}%` }}
                    ></div>
                  </div>

                  {/* Nhãn tháng dưới đáy */}
                  <span className="text-sm font-semibold text-gray-500 mt-4">
                    {item.monthLabel}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2 BOX THỐNG KÊ CHI TIẾT (Đơn hàng & Danh mục) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Box Tình trạng đơn hàng */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Activity className="mr-2 text-indigo-600" size={24} /> Tình trạng
            đơn hàng
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Chờ duyệt (Pending)
                </span>
                <span className="text-sm font-bold text-gray-800">
                  {stats.ordersByStatus.Pending || 0} đơn
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-yellow-400 h-2.5 rounded-full"
                  style={{
                    width: `${getPercentage(stats.ordersByStatus.Pending, stats.totalOrders)}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Đang giao (Processing)
                </span>
                <span className="text-sm font-bold text-gray-800">
                  {stats.ordersByStatus.Processing || 0} đơn
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{
                    width: `${getPercentage(stats.ordersByStatus.Processing, stats.totalOrders)}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Đã giao (Delivered)
                </span>
                <span className="text-sm font-bold text-gray-800">
                  {stats.ordersByStatus.Delivered || 0} đơn
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{
                    width: `${getPercentage(stats.ordersByStatus.Delivered, stats.totalOrders)}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Đã hủy (Cancelled)
                </span>
                <span className="text-sm font-bold text-gray-800">
                  {stats.ordersByStatus.Cancelled || 0} đơn
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-red-500 h-2.5 rounded-full"
                  style={{
                    width: `${getPercentage(stats.ordersByStatus.Cancelled, stats.totalOrders)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Box Thống kê sản phẩm (Có cuộn chuột) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center shrink-0">
            <PieChart className="mr-2 text-pink-600" size={24} /> Cơ cấu Danh
            mục Sản phẩm
          </h2>

          {stats.productsByCategory.length === 0 ? (
            <div className="text-center py-10 text-gray-500 italic flex-grow flex items-center justify-center">
              Chưa có dữ liệu phân loại.
            </div>
          ) : (
            <div
              className="grid grid-cols-1 xl:grid-cols-2 gap-4 max-h-[250px] overflow-y-auto pr-2 
              [&::-webkit-scrollbar]:w-1.5 
              [&::-webkit-scrollbar-track]:bg-transparent 
              [&::-webkit-scrollbar-thumb]:bg-gray-200 
              [&::-webkit-scrollbar-thumb]:rounded-full 
              hover:[&::-webkit-scrollbar-thumb]:bg-gray-300"
            >
              {stats.productsByCategory.map((cat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                >
                  <div className="flex items-center overflow-hidden">
                    <div className="w-2.5 h-2.5 rounded-full bg-pink-400 mr-3 shrink-0"></div>
                    <span
                      className="font-semibold text-gray-700 truncate"
                      title={cat.categoryName || "Chưa phân loại"}
                    >
                      {cat.categoryName || "Chưa phân loại"}
                    </span>
                  </div>
                  <span className="bg-white border border-gray-200 px-2.5 py-0.5 rounded-lg text-sm font-bold text-gray-600 shadow-sm shrink-0 ml-2">
                    {cat.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
