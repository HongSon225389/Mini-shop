import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Search,
  LogOut,
  ChevronDown,
  Package,
  ClipboardList,
  TrendingUp,
  Bell,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import axiosInstance from "../utils/axiosInstance";

const Navbar = () => {
  const [keyword, setKeyword] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // STATE LƯU SỐ LƯỢNG ĐƠN HÀNG CHỜ DUYỆT CỦA ADMIN
  const [pendingOrders, setPendingOrders] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const totalItems = cartItems?.reduce((acc, item) => acc + item.qty, 0) || 0;

  // LOGIC LẤY THÔNG BÁO CHO ADMIN (POLLING)
  useEffect(() => {
    // Chỉ chạy logic này nếu người dùng đăng nhập là Admin
    if (userInfo?.role === "admin") {
      const fetchPendingOrders = async () => {
        try {
          // Chỉ cần lấy số lượng đơn đang Pending để cho nhẹ server
          const { data } = await axiosInstance.get(
            "/orders?status=Pending&limit=1",
          );
          setPendingOrders(data.totalOrders || 0);
        } catch (error) {
          console.error("Lỗi lấy thông báo:", error);
        }
      };

      // Gọi lần đầu ngay khi load trang
      fetchPendingOrders();

      // Cứ sau 15 giây (15000ms) sẽ tự động hỏi lại Backend 1 lần
      const intervalId = setInterval(fetchPendingOrders, 15000);

      // Dọn dẹp interval khi component bị hủy
      return () => clearInterval(intervalId);
    }
  }, [userInfo]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/shop?keyword=${keyword}`);
    } else {
      navigate("/shop");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-xl font-bold text-blue-600 tracking-wider"
          >
            T1-SHOP
          </Link>
          <div className="hidden md:flex items-center space-x-4 font-medium text-gray-600">
            <Link to="/" className="hover:text-blue-600">
              Trang chủ
            </Link>
            <Link to="/shop" className="hover:text-blue-600">
              Cửa hàng
            </Link>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8 relative">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border rounded-full text-sm focus:outline-none focus:border-blue-500 bg-gray-50"
          />
          <button
            type="submit"
            className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600"
          >
            <Search size={18} />
          </button>
        </form>

        <div className="flex items-center space-x-6">
          {/* ICON THÔNG BÁO DÀNH CHO ADMIN */}
          {userInfo?.role === "admin" && (
            <Link
              to="/admin/orders"
              className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors"
              title="Đơn hàng chờ duyệt"
            >
              <Bell size={22} />
              {pendingOrders > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1 -translate-y-1 shadow-md animate-pulse">
                  {pendingOrders}
                </span>
              )}
            </Link>
          )}

          {/* ICON GIỎ HÀNG DÀNH CHO USER */}
          {userInfo?.role !== "admin" && (
            <Link
              to="/cart"
              className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* MENU USER / ADMIN */}
          {userInfo ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-1 text-gray-700 font-medium hover:text-blue-600 focus:outline-none"
              >
                <User size={18} />
                <span className="text-sm max-w-[100px] truncate">
                  {userInfo.name}
                </span>
                <ChevronDown size={14} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-xl py-2 text-sm z-50">
                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    Hồ sơ cá nhân
                  </Link>

                  {userInfo.role === "admin" && (
                    <div className="bg-gray-50 mt-1 pb-1">
                      <div className="px-4 py-2 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                        Admin Menu
                      </div>
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition-colors"
                      >
                        <TrendingUp size={16} className="mr-2" /> Thống kê Shop
                      </Link>
                      <Link
                        to="/admin/products"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition-colors"
                      >
                        <Package size={16} className="mr-2" /> Quản lý Sản phẩm
                      </Link>
                      <Link
                        to="/admin/orders"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition-colors"
                      >
                        <ClipboardList size={16} className="mr-2" /> Quản lý Đơn
                        hàng
                        {/* Hiện số đếm nhỏ trong cả menu thả xuống */}
                        {pendingOrders > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {pendingOrders}
                          </span>
                        )}
                      </Link>
                    </div>
                  )}

                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                  >
                    <LogOut size={16} />
                    <span className="font-medium">Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3 text-sm font-medium">
              <Link to="/login" className="text-gray-600 hover:text-blue-600">
                Đăng nhập
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
