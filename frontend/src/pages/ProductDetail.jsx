// frontend/src/pages/ProductDetail.jsx
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  MessageSquare,
  ShieldCheck,
  Send,
} from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);

  // Trigger để fetch lại dữ liệu sau khi đánh giá
  const [refresh, setRefresh] = useState(false);

  // State cho Form Đánh giá
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Không thể tải thông tin sản phẩm",
        );
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id, refresh]); // Thêm refresh vào dependency

  const addToCartHandler = () => {
    if (userInfo?.role !== "admin") {
      dispatch(addToCart({ ...product, qty }));
      navigate("/cart");
    }
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    try {
      setReviewLoading(true);
      setReviewError("");

      await axiosInstance.post(`/products/${id}/reviews`, {
        rating,
        comment,
      });

      alert("Cảm ơn bạn đã đánh giá!");
      setRating(5);
      setComment("");
      setRefresh(!refresh); // Bật cờ để load lại trang, hiện review mới
      setReviewLoading(false);
    } catch (err) {
      setReviewError(err.response?.data?.message || "Lỗi khi gửi đánh giá");
      setReviewLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  if (error)
    return (
      <div className="text-center py-20">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg inline-block">
          {error}
        </div>
        <div className="mt-4">
          <Link to="/shop" className="text-blue-600 hover:underline">
            Quay lại cửa hàng
          </Link>
        </div>
      </div>
    );

  const imageUrl = product.image?.startsWith("/uploads")
    ? `http://localhost:5000${product.image}`
    : product.image;

  return (
    <div className="py-6 px-4 md:px-0 max-w-7xl mx-auto">
      <Link
        to="/shop"
        className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" /> Quay lại cửa hàng
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 lg:p-12">
          {/* Cột Trái: Ảnh */}
          <div className="flex justify-center items-center bg-gray-50 rounded-2xl p-6">
            <img
              src={imageUrl}
              alt={product.name}
              className="max-w-full h-auto object-contain max-h-[450px] rounded-lg hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Cột Phải: Thông tin */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center space-x-3 mb-6 text-sm">
                <div className="flex text-amber-400 bg-amber-50 px-3 py-1 rounded-full items-center">
                  <Star fill="currentColor" size={16} />
                  <span className="ml-1.5 font-bold text-amber-600">
                    {product.rating?.toFixed(1) || "0.0"}
                  </span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500 font-medium">
                  {product.numReviews} Đánh giá
                </span>
              </div>
              <div className="text-4xl font-black text-red-600 mb-6">
                {product.price?.toLocaleString("vi-VN")} đ
              </div>
              <p className="text-gray-600 leading-relaxed mb-8 border-y border-gray-100 py-6">
                {product.description}
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              {userInfo?.role === "admin" ? (
                <div className="text-center space-y-4 py-4">
                  <div className="flex justify-center text-blue-600">
                    <ShieldCheck size={48} />
                  </div>
                  <p className="text-gray-700 font-bold">
                    Bạn đang xem với quyền Quản trị viên
                  </p>
                  <Link
                    to="/admin/products"
                    className="block w-full bg-gray-800 text-white py-3.5 rounded-xl font-bold hover:bg-black transition-all"
                  >
                    Quản lý kho hàng
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-700 font-bold">Trạng thái:</span>
                    <span
                      className={`font-bold px-4 py-1.5 rounded-full text-sm ${product.countInStock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {product.countInStock > 0
                        ? `Còn hàng (${product.countInStock})`
                        : "Hết hàng"}
                    </span>
                  </div>

                  {product.countInStock > 0 && (
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-gray-700 font-bold">Số lượng:</span>
                      <select
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="border-2 border-gray-200 rounded-xl px-5 py-2.5 focus:outline-none focus:border-blue-500 font-bold text-lg bg-white"
                      >
                        {[
                          ...Array(Math.min(product.countInStock, 10)).keys(),
                        ].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0}
                    className="w-full bg-blue-600 text-white py-4.5 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all flex justify-center items-center space-x-2 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                  >
                    <ShoppingCart size={24} />
                    <span>Thêm vào giỏ hàng</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KHU VỰC BÌNH LUẬN VÀ ĐÁNH GIÁ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cột trái: Form viết đánh giá */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-24">
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
              Viết đánh giá của bạn
            </h3>

            {!userInfo ? (
              <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-center">
                Vui lòng{" "}
                <Link to="/login" className="font-bold underline">
                  đăng nhập
                </Link>{" "}
                để viết đánh giá.
              </div>
            ) : userInfo.role === "admin" ? (
              <div className="bg-gray-50 text-gray-500 p-4 rounded-xl text-center italic">
                Admin không thể viết đánh giá sản phẩm.
              </div>
            ) : (
              <form onSubmit={submitReviewHandler} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Chất lượng sản phẩm
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 bg-gray-50 font-medium"
                  >
                    <option value="5">5 Sao - Tuyệt vời</option>
                    <option value="4">4 Sao - Rất tốt</option>
                    <option value="3">3 Sao - Bình thường</option>
                    <option value="2">2 Sao - Hơi kém</option>
                    <option value="1">1 Sao - Quá tệ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Trải nghiệm của bạn
                  </label>
                  <textarea
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 bg-gray-50 resize-none"
                  ></textarea>
                </div>

                {reviewError && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                    {reviewError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="w-full bg-gray-800 text-white py-3.5 rounded-xl font-bold hover:bg-black transition-all flex justify-center items-center disabled:bg-gray-400"
                >
                  {reviewLoading ? (
                    "Đang gửi..."
                  ) : (
                    <>
                      <Send size={18} className="mr-2" /> Gửi đánh giá
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Cột phải: Danh sách review */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
              <MessageSquare size={24} className="mr-3 text-blue-600" /> Đánh
              giá từ khách hàng ({product.numReviews})
            </h2>

            {product.reviews && product.reviews.length === 0 ? (
              <div className="bg-gray-50 text-gray-500 p-10 rounded-2xl text-center border border-dashed border-gray-300">
                Chưa có đánh giá nào. Hãy là người đầu tiên trải nghiệm và chia
                sẻ cảm nhận!
              </div>
            ) : (
              <div className="space-y-6">
                {product.reviews?.map((review) => (
                  <div
                    key={review._id}
                    className="bg-gray-50 p-6 rounded-2xl border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <strong className="text-gray-800 text-lg block">
                          {review.name}
                        </strong>
                        <span className="text-xs font-medium text-gray-400">
                          {review.createdAt?.substring(0, 10)}
                        </span>
                      </div>
                      <div className="flex text-amber-400 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            fill={
                              index < review.rating ? "currentColor" : "none"
                            }
                            size={14}
                            className={
                              index < review.rating ? "" : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
