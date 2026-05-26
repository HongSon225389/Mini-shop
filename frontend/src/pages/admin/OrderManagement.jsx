import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import { ClipboardList, Search, Filter } from "lucide-react";

const OrderManagement = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    if (!userInfo || userInfo.role !== "admin") {
      navigate("/");
    } else {
      fetchOrders();
    }
  }, [userInfo, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/orders?limit=100");
      setOrders(data.orders || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, targetStatus) => {
    let confirmMsg = "";
    if (targetStatus === "Processing")
      confirmMsg = "Bạn muốn duyệt đơn hàng này? (Hệ thống sẽ trừ tồn kho)";
    if (targetStatus === "Delivered")
      confirmMsg = "Xác nhận đơn hàng này ĐÃ GIAO thành công?";
    if (targetStatus === "Cancelled")
      confirmMsg = "Bạn có chắc chắn muốn HỦY đơn hàng này?";

    if (window.confirm(confirmMsg)) {
      try {
        await axiosInstance.put(`/orders/${id}/status`, {
          status: targetStatus,
        });
        fetchOrders();
      } catch (err) {
        alert(err.response?.data?.message || "Lỗi khi cập nhật trạng thái");
      }
    }
  };

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      order._id.toLowerCase().includes(term) ||
      order.createdAt?.substring(0, 10).includes(term) ||
      order.user?.name?.toLowerCase().includes(term) ||
      false;

    // Lọc theo trạng thái
    const matchStatus = filterStatus === "All" || order.status === filterStatus;

    // Trả về kết quả thỏa mãn CẢ HAI điều kiện
    return matchSearch && matchStatus;
  });

  return (
    <div className="py-6">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <ClipboardList className="mr-2 text-blue-600" /> Quản lý Đơn hàng
        </h1>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          {/* LỌC THEO TRẠNG THÁI */}
          <div className="relative w-full sm:w-auto flex items-center bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2 text-sm focus-within:border-blue-500">
            <Filter size={16} className="text-gray-400 mr-2" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent focus:outline-none text-gray-700 w-full cursor-pointer"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="Pending">Chờ duyệt</option>
              <option value="Processing">Đang giao</option>
              <option value="Delivered">Đã giao</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
          </div>

          {/* THANH TÌM KIẾM */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Mã đơn, Tên khách hàng, Ngày..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white shadow-sm"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

          <Link
            to="/admin/dashboard"
            className="text-sm font-medium text-blue-600 hover:underline whitespace-nowrap"
          >
            &larr; Về Dashboard
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-gray-600 font-semibold text-sm">
                MÃ ĐƠN
              </th>
              <th className="p-4 text-gray-600 font-semibold text-sm">
                KHÁCH HÀNG
              </th>
              <th className="p-4 text-gray-600 font-semibold text-sm">
                NGÀY ĐẶT
              </th>
              <th className="p-4 text-gray-600 font-semibold text-sm">
                TỔNG TIỀN
              </th>
              <th className="p-4 text-center text-gray-600 font-semibold text-sm">
                TRẠNG THÁI
              </th>
              <th className="p-4 text-center text-gray-600 font-semibold text-sm">
                THAO TÁC
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  Không tìm thấy đơn hàng nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-sm font-mono text-blue-600">
                    #{order._id.substring(0, 8)}
                  </td>
                  <td className="p-4 font-semibold text-gray-800">
                    {order.user?.name || "N/A"}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {order.createdAt?.substring(0, 10)}
                  </td>
                  <td className="p-4 text-red-600 font-bold">
                    {order.totalPrice?.toLocaleString("vi-VN")} đ
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
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
                  <td className="p-4 flex justify-center items-center space-x-2">
                    <Link
                      to={`/order/${order._id}`}
                      className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                    >
                      Chi tiết
                    </Link>

                    {order.status === "Pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateOrderStatus(order._id, "Processing")
                          }
                          className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                        >
                          Duyệt đơn
                        </button>
                        <button
                          onClick={() =>
                            updateOrderStatus(order._id, "Cancelled")
                          }
                          className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                        >
                          Hủy
                        </button>
                      </>
                    )}

                    {order.status === "Processing" && (
                      <>
                        <button
                          onClick={() =>
                            updateOrderStatus(order._id, "Delivered")
                          }
                          className="bg-green-50 text-green-600 hover:bg-green-600 hover:text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                        >
                          Đã giao
                        </button>
                        <button
                          onClick={() =>
                            updateOrderStatus(order._id, "Cancelled")
                          }
                          className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                        >
                          Hủy
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
