import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { setCredentials } from "../store/authSlice";
import {
  User as UserIcon,
  Package,
  Search,
  Filter,
  ShieldCheck,
  ArrowRight,
  Edit2,
  MapPin,
  Phone,
  Mail,
  X,
  Save,
  Lock,
  ClipboardList,
} from "lucide-react";

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0 });
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userInfo?.name || "");
  const [phone, setPhone] = useState(userInfo?.phone || "");
  const [address, setAddress] = useState(userInfo?.address || "");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (userInfo?.role === "admin") {
      setLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const ordersRes = await axiosInstance.get("/orders/myorders?limit=100");
        setOrders(ordersRes.data.orders || []);

        const statsRes = await axiosInstance.get("/orders/my-stats");
        setStats({
          totalOrders: statsRes.data.totalOrders || 0,
          totalSpent: statsRes.data.totalSpent || 0,
        });

        setLoading(false);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [userInfo]);

  const updateProfileHandler = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      setUpdateLoading(true);
      const updateData = { name, phone, address };
      if (password) {
        updateData.password = password;
      }

      const { data } = await axiosInstance.put("/users/profile", updateData);

      dispatch(setCredentials(data));

      setIsEditing(false);
      setPassword("");
      setConfirmPassword("");
      setUpdateLoading(false);
      alert("Cập nhật thông tin thành công!");
    } catch (err) {
      setUpdateLoading(false);
      alert(err.response?.data?.message || "Lỗi cập nhật!");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      order._id.toLowerCase().includes(term) ||
      order.createdAt?.substring(0, 10).includes(term);
    const matchStatus = filterStatus === "All" || order.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="py-8 max-w-6xl mx-auto px-4 min-h-[75vh]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden transition-all duration-300">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-full transition-all"
                title="Chỉnh sửa thông tin"
              >
                <Edit2 size={16} />
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-full transition-all"
              >
                <X size={16} />
              </button>
            )}

            <div className="flex flex-col items-center text-center mb-8">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-inner ${userInfo?.role === "admin" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}
              >
                {userInfo?.role === "admin" ? (
                  <ShieldCheck size={44} />
                ) : (
                  <UserIcon size={44} />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {userInfo?.name}
              </h2>
              <span
                className={`mt-2 px-4 py-1 rounded-full text-[12px] font-black uppercase tracking-widest border ${userInfo?.role === "admin" ? "bg-red-50 text-red-600 border-red-100" : "bg-gray-50 text-gray-500 border-gray-100"}`}
              >
                {userInfo?.role === "admin" ? "Quản Trị Viên" : "Khách hàng"}
              </span>
            </div>

            {isEditing ? (
              <form
                onSubmit={updateProfileHandler}
                className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <div className="space-y-3">
                  <div className="group">
                    <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm"
                    />
                  </div>
                  <div className="group">
                    <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Nhập số điện thoại..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm"
                    />
                  </div>
                  <div className="group">
                    <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">
                      Địa chỉ nhận hàng
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows="2"
                      placeholder="Nhập địa chỉ..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm resize-none"
                    />
                  </div>

                  <div className="pt-2 border-t border-dashed border-gray-200">
                    <div className="group mb-3">
                      <label className="text-[11px] font-bold text-blue-500 uppercase ml-1 flex items-center">
                        <Lock size={12} className="mr-1" /> Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Bỏ trống nếu không đổi"
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                      />
                    </div>

                    {password && (
                      <div className="group animate-in fade-in zoom-in-95 duration-200">
                        <label
                          className={`text-[11px] font-bold uppercase ml-1 ${confirmPassword && password !== confirmPassword ? "text-red-500" : "text-gray-400"}`}
                        >
                          Xác nhận mật khẩu mới
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:outline-none text-sm transition-all ${
                            confirmPassword && password !== confirmPassword
                              ? "border-red-500 ring-2 ring-red-50"
                              : "border-gray-200 focus:border-blue-500"
                          }`}
                        />
                        {confirmPassword && password !== confirmPassword && (
                          <p className="text-[10px] text-red-500 mt-1 italic ml-1">
                            Mật khẩu xác nhận chưa khớp!
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updateLoading}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex justify-center items-center disabled:bg-blue-300"
                >
                  {updateLoading ? (
                    "Đang lưu..."
                  ) : (
                    <>
                      <Save size={18} className="mr-2" /> Cập nhật hồ sơ
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-5 border-t border-gray-50 pt-6">
                <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-2xl">
                  <Mail size={18} className="mr-3 text-blue-500 shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {userInfo?.email}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-2xl">
                  <Phone size={18} className="mr-3 text-blue-500 shrink-0" />
                  <span className="text-sm font-medium">
                    {userInfo?.phone || "Chưa cập nhật SĐT"}
                  </span>
                </div>
                <div className="flex items-start text-gray-600 bg-gray-50 p-3 rounded-2xl">
                  <MapPin
                    size={18}
                    className="mr-3 text-blue-500 shrink-0 mt-0.5"
                  />
                  <span className="text-sm font-medium">
                    {userInfo?.address || "Chưa cập nhật địa chỉ"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {userInfo?.role !== "admin" && (
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-3xl shadow-lg shadow-blue-100 text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center opacity-90">
                <Package className="mr-2" size={20} /> Tổng quan chi tiêu
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl">
                  <span className="text-sm opacity-80">Tổng đơn hàng</span>
                  <span className="font-bold text-xl">{stats.totalOrders}</span>
                </div>
                <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl">
                  <span className="text-sm opacity-80">Đã chi tiêu</span>
                  <span className="font-bold text-xl">
                    {stats.totalSpent.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          {userInfo?.role === "admin" ? (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 h-full flex flex-col justify-center items-center text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck size={48} />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Trang cá nhân Quản trị
              </h2>
              <p className="text-gray-500 mb-8 max-w-sm">
                Chào mừng sếp quay trở lại! Để quản lý đơn hàng, khách hàng và
                sản phẩm, vui lòng truy cập Dashboard.
              </p>
              <Link
                to="/admin/dashboard"
                className="group flex items-center bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl"
              >
                Đi tới Dashboard{" "}
                <ArrowRight
                  size={20}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <ClipboardList className="mr-2 text-blue-600" size={24} />{" "}
                  Lịch sử đơn hàng
                </h2>

                <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
                  <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                    <Filter size={14} className="text-gray-400 mr-2" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-transparent focus:outline-none text-xs font-bold text-gray-600 w-full cursor-pointer"
                    >
                      <option value="All">Tất cả</option>
                      <option value="Pending">Chờ duyệt</option>
                      <option value="Processing">Đang giao</option>
                      <option value="Delivered">Đã giao</option>
                      <option value="Cancelled">Đã hủy</option>
                    </select>
                  </div>

                  <div className="relative w-full sm:w-56">
                    <input
                      type="text"
                      placeholder="Tìm mã đơn, ngày..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 bg-gray-50 font-medium"
                    />
                    <Search
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={14}
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 text-[11px] uppercase tracking-widest border-b border-gray-50">
                      <th className="pb-4 font-black">Mã đơn</th>
                      <th className="pb-4 font-black">Ngày đặt</th>
                      <th className="pb-4 font-black text-center">
                        Trạng thái
                      </th>
                      <th className="pb-4 font-black text-right">Tổng tiền</th>
                      <th className="pb-4 font-black text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-10 text-center text-gray-400 italic"
                        >
                          Đang tải lịch sử đơn hàng...
                        </td>
                      </tr>
                    ) : filteredOrders.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-10 text-center text-gray-400 italic"
                        >
                          Không tìm thấy đơn hàng nào phù hợp.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr
                          key={order._id}
                          className="hover:bg-gray-50/50 transition-colors group"
                        >
                          <td className="py-4 text-[13px] font-mono font-bold text-blue-600">
                            #{order._id.substring(18).toUpperCase()}
                          </td>
                          <td className="py-4 text-[13px] text-gray-500">
                            {order.createdAt?.substring(0, 10)}
                          </td>
                          <td className="py-4 text-center">
                            <span
                              className={`px-3 py-1 text-[11px] font-bold rounded-full ${
                                order.status === "Pending"
                                  ? "bg-yellow-50 text-yellow-600"
                                  : order.status === "Processing"
                                    ? "bg-blue-50 text-blue-600"
                                    : order.status === "Delivered"
                                      ? "bg-green-50 text-green-600"
                                      : "bg-red-50 text-red-600"
                              }`}
                            >
                              {order.status === "Pending"
                                ? "Chờ duyệt"
                                : order.status === "Processing"
                                  ? "Đang giao"
                                  : order.status === "Delivered"
                                    ? "Đã giao"
                                    : "Đã hủy"}
                            </span>
                          </td>
                          <td className="py-4 text-right font-black text-gray-800 text-[14px]">
                            {order.totalPrice?.toLocaleString("vi-VN")} đ
                          </td>
                          <td className="py-4 text-center">
                            <Link
                              to={`/order/${order._id}`}
                              className="inline-flex items-center px-4 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all shadow-sm"
                            >
                              Chi tiết
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
