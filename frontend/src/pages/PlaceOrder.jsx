// frontend/src/pages/PlaceOrder.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCartItems } from "../store/cartSlice";
import axiosInstance from "../utils/axiosInstance";
import { CheckCircle, MapPin, CreditCard, ShoppingBag } from "lucide-react";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Nếu giỏ hàng trống thì đá về Shop
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/shop");
    }
    if (!userInfo) {
      navigate("/login");
    }
  }, [cartItems, navigate, userInfo]);

  // Tính tiền
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const shippingPrice = itemsPrice > 5000000 ? 0 : 50000; // Freeship đơn trên 5 triệu
  const totalPrice = itemsPrice + shippingPrice;

  const placeOrderHandler = async () => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.post("/orders", {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.qty,
        })),
        shippingAddress: `${userInfo.address || "Chưa cập nhật"} - SĐT: ${userInfo.phone || "Chưa cập nhật"}`,
        paymentMethod: "Thanh toán khi nhận hàng (COD)",
        itemsPrice,
        shippingPrice,
        totalPrice,
      });

      // Xóa giỏ hàng trong Redux sau khi đặt thành công
      dispatch(clearCartItems());

      alert("Tuyệt vời! Bạn đã đặt hàng thành công.");
      navigate("/profile"); // Chuyển về trang cá nhân để xem đơn
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi đặt hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
        <CheckCircle className="mr-3 text-blue-600" size={32} /> Xác nhận đặt
        hàng
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cột trái: Thông tin đơn */}
        <div className="w-full lg:w-2/3 space-y-6">
          {/* Địa chỉ giao hàng */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center border-b pb-4">
              <MapPin className="mr-2 text-gray-500" /> Thông tin giao hàng
            </h2>
            <p className="mb-2">
              <span className="font-semibold">Người nhận:</span>{" "}
              {userInfo?.name}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Điện thoại:</span>{" "}
              {userInfo?.phone || "Chưa có SĐT"}
            </p>
            <p>
              <span className="font-semibold">Địa chỉ:</span>{" "}
              {userInfo?.address || "Chưa có địa chỉ"}
            </p>
          </div>

          {/* Phương thức thanh toán */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center border-b pb-4">
              <CreditCard className="mr-2 text-gray-500" /> Phương thức thanh
              toán
            </h2>
            <p className="text-gray-700 font-medium">
              Thanh toán tiền mặt khi nhận hàng (COD)
            </p>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center border-b pb-4">
              <ShoppingBag className="mr-2 text-gray-500" /> Sản phẩm đã chọn
            </h2>
            <div className="divide-y divide-gray-100">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        item.image.startsWith("/uploads")
                          ? `http://localhost:5000${item.image}`
                          : item.image
                      }
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <Link
                      to={`/product/${item._id}`}
                      className="font-medium text-blue-600 hover:underline line-clamp-1"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <div className="font-semibold text-gray-700">
                    {item.qty} x {item.price.toLocaleString("vi-VN")} đ ={" "}
                    {(item.qty * item.price).toLocaleString("vi-VN")} đ
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cột phải: Tổng kết tiền */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
              Tổng cộng
            </h2>

            {error && (
              <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4 mb-6 text-gray-600">
              <div className="flex justify-between">
                <span>Tiền hàng:</span>
                <span className="font-semibold">
                  {itemsPrice.toLocaleString("vi-VN")} đ
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="font-semibold">
                  {shippingPrice === 0
                    ? "Miễn phí"
                    : `${shippingPrice.toLocaleString("vi-VN")} đ`}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8 border-t pt-4 text-xl">
              <span className="font-bold text-gray-800">Thành tiền:</span>
              <span className="font-extrabold text-red-600">
                {totalPrice.toLocaleString("vi-VN")} đ
              </span>
            </div>

            <button
              onClick={placeOrderHandler}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors flex justify-center items-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Chốt Đơn Ngay"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
