import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../store/cartSlice";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo?.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [userInfo, navigate]);

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      dispatch(removeFromCart(id));
    }
  };

  const checkoutHandler = () => {
    navigate("/placeorder");
  };

  return (
    <div className="py-8 px-4 md:px-0">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
        <ShoppingBag className="mr-3 text-blue-600" size={32} /> Giỏ hàng của
        bạn
      </h1>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
          <div className="flex justify-center mb-4">
            <ShoppingBag size={64} className="text-gray-200" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            Giỏ hàng đang trống
          </h2>
          <p className="text-gray-500 mb-6">
            Có vẻ như bạn chưa chọn mua sản phẩm nào.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" /> Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 font-semibold text-gray-600 text-sm">
                <div className="col-span-6">Sản phẩm</div>
                <div className="col-span-2 text-center">Đơn giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-center">Thao tác</div>
              </div>

              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center"
                  >
                    <div className="col-span-1 md:col-span-6 flex items-center space-x-4">
                      <img
                        src={
                          item.image?.startsWith("/uploads")
                            ? `http://localhost:5000${item.image}`
                            : item.image
                        }
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg bg-gray-50"
                      />
                      <Link
                        to={`/product/${item._id}`}
                        className="font-medium text-gray-800 hover:text-blue-600 line-clamp-2"
                      >
                        {item.name}
                      </Link>
                    </div>

                    <div className="col-span-1 md:col-span-2 text-left md:text-center font-semibold text-red-600">
                      {item.price?.toLocaleString("vi-VN")} đ
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center">
                      <select
                        value={item.qty}
                        onChange={(e) =>
                          addToCartHandler(item, Number(e.target.value))
                        }
                        className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                      >
                        {[...Array(Math.min(item.countInStock, 10)).keys()].map(
                          (x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ),
                        )}
                      </select>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-end md:justify-center">
                      <button
                        onClick={() => removeFromCartHandler(item._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Xóa khỏi giỏ"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
                Tổng quan đơn hàng
              </h2>

              <div className="flex justify-between items-center mb-4 text-gray-600">
                <span>Tổng số sản phẩm:</span>
                <span className="font-semibold">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)} món
                </span>
              </div>

              <div className="flex justify-between items-center mb-6 text-xl">
                <span className="font-bold text-gray-800">Tạm tính:</span>
                <span className="font-extrabold text-red-600">
                  {cartItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toLocaleString("vi-VN")}{" "}
                  đ
                </span>
              </div>

              <button
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400 shadow-lg"
              >
                Tiến hành đặt hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
