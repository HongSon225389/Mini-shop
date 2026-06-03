import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { ArrowLeft, MapPin, CreditCard, ShoppingBag, User } from "lucide-react";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/orders/${id}`);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Không thể tải chi tiết đơn hàng",
        );
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading) return <div className="text-center py-20">Đang tải...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!order) return null;

  return (
    <div className="py-8 max-w-6xl mx-auto px-4">
      <div className="mb-6">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={20} className="mr-2" /> Quay lại
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Chi tiết đơn hàng: #{order._id.substring(0, 8)}
        </h1>
        <span
          className={`px-4 py-2 rounded-full font-bold text-sm ${
            order.status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : order.status === "Processing"
                ? "bg-blue-100 text-blue-700"
                : order.status === "Delivered"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
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
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b pb-3">
              <User className="mr-2 text-gray-500" size={20} /> Khách hàng
            </h2>
            <p className="mb-2">
              <span className="font-semibold">Tên:</span>{" "}
              {order.user?.name || "Khách hàng"}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {order.user?.email || "N/A"}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b pb-3">
              <MapPin className="mr-2 text-gray-500" size={20} /> Thông tin Giao
              hàng
            </h2>
            <p className="mb-2">
              <span className="font-semibold">Địa chỉ & SĐT:</span>{" "}
              {order.shippingAddress}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b pb-3">
              <ShoppingBag className="mr-2 text-gray-500" size={20} /> Sản phẩm
              đã đặt
            </h2>
            <div className="divide-y divide-gray-100">
              {order.orderItems.map((item, index) => (
                <div
                  key={index}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        item.image?.startsWith("/uploads")
                          ? `http://localhost:5000${item.image}`
                          : item.image
                      }
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <Link
                      to={`/product/${item.product}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <div className="font-semibold text-gray-700">
                    {item.quantity} x {item.price.toLocaleString("vi-VN")} đ
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
              Thanh toán
            </h2>

            <div className="space-y-4 mb-6 text-gray-600">
              <div className="flex justify-between">
                <span>Tiền hàng:</span>
                <span className="font-semibold">
                  {order.itemsPrice?.toLocaleString("vi-VN")} đ
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="font-semibold">
                  {order.shippingPrice === 0
                    ? "Miễn phí"
                    : `${order.shippingPrice?.toLocaleString("vi-VN")} đ`}
                </span>
              </div>
              <div className="flex justify-between items-center text-green-600">
                <span className="flex items-center">
                  <CreditCard size={18} className="mr-1" /> Hình thức:
                </span>
                <span className="font-semibold">{order.paymentMethod}</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t pt-4 text-xl">
              <span className="font-bold text-gray-800">Tổng cộng:</span>
              <span className="font-extrabold text-red-600">
                {order.totalPrice?.toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
