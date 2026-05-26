import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../store/authSlice";
import axiosInstance from "../utils/axiosInstance";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Phone,
  MapPin,
} from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axiosInstance.post("/auth/register", {
        name,
        email,
        phone,
        address,
        password,
      });

      localStorage.setItem("token", data.token);
      dispatch(setCredentials(data));
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-10 px-4 my-4 bg-gray-900 relative overflow-hidden">
      {/* Nền đằng sau khung chính */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-gray-900 to-black"></div>

      {/* Khung chứa chính */}
      <div className="w-full max-w-[1200px] bg-white rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row border border-gray-800 min-h-[700px] relative z-10">
        {/* --- CỘT TRÁI: NỀN MẠCH ĐIỆN SỐNG ĐỘNG (Đồng bộ với Login) --- */}
        <div className="hidden md:flex md:w-[55%] lg:w-[60%] relative overflow-hidden bg-[#0a0a16] flex-col p-12 justify-between">
          {/* Ảnh vân mạch điện nền */}
          <div
            className="absolute inset-0 opacity-40 mix-blend-screen"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          {/* Các vệt sáng Neon */}
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-pink-600/30 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-20%] w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
          <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-blue-500/30 rounded-full blur-[90px] pointer-events-none mix-blend-screen"></div>

          {/* Nội dung Cột Trái */}
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white tracking-widest drop-shadow-lg mb-1">
              LHS
            </h3>
            <p className="text-sm text-cyan-300 font-medium tracking-wide mb-4">
              Cửa hàng công nghệ T1
            </p>

            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] mb-6">
              T1-SHOP
            </h1>

            <p className="text-base text-gray-300 max-w-md leading-relaxed font-medium">
              Gia nhập cộng đồng yêu công nghệ. Hàng ngàn sản phẩm chính hãng
              với mức giá tốt nhất đang chờ đón bạn!
            </p>
          </div>

          {/* THẺ KÍNH (GLASSMORPHISM) */}
          <div className="relative z-10 mt-auto hidden lg:block">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl max-w-lg relative overflow-hidden group">
              <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-12"></div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 text-white">
                  <h3 className="font-bold text-2xl tracking-wide mb-1 drop-shadow-md">
                    Deal Hot Mùa Hè <span className="text-cyan-300">50%</span>
                  </h3>
                  <h4 className="text-lg font-semibold mb-3 drop-shadow-md">
                    Giảm kịch sàn
                  </h4>
                  <div className="space-y-1.5 text-xs text-gray-200 font-medium">
                    <p className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-pink-400 rounded-full"></span>{" "}
                      Đặc quyền thành viên mới
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>{" "}
                      Tích điểm mọi đơn hàng
                    </p>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-cyan-400/20 border border-cyan-300/50 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] relative z-10">
                  <span className="text-lg font-black text-cyan-100">50%</span>
                </div>
                <div className="w-24 h-32 ml-2 flex-shrink-0 relative z-10">
                  <img
                    src="/public/baner.png"
                    alt="iPhone"
                    className="w-full h-full object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: FORM ĐĂNG KÝ --- */}
        <div className="w-full md:w-[45%] lg:w-[40%] bg-white p-8 lg:p-12 flex flex-col justify-center items-center">
          <div className="w-full max-w-sm">
            {/* Header Form */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/30">
                <UserPlus size={24} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-1">
                Tạo tài khoản mới
              </h2>
              <p className="text-gray-500 text-sm font-medium">
                Trở thành thành viên của T1-SHOP
              </p>
            </div>

            {/* Thông báo lỗi */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg text-center font-medium">
                {error}
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-3.5">
              {/* Họ và tên (Full width) */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm text-gray-800 placeholder-gray-400"
                  placeholder="Họ và tên"
                />
              </div>

              {/* Dòng chia 2 cột: Email & Số điện thoại */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm text-gray-800 placeholder-gray-400"
                    placeholder="Email"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm text-gray-800 placeholder-gray-400"
                    placeholder="Số điện thoại"
                  />
                </div>
              </div>

              {/* Địa chỉ (Full width) */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <MapPin size={18} />
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm text-gray-800 placeholder-gray-400"
                  placeholder="Địa chỉ giao hàng"
                />
              </div>

              {/* Dòng chia 2 cột: Mật khẩu & Xác nhận */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm text-gray-800 placeholder-gray-400"
                    placeholder="Password"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-10 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm text-gray-800 placeholder-gray-400"
                    placeholder="Password confirmation"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Nút Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1660b3] text-white font-semibold py-3.5 rounded-lg hover:bg-[#124d90] transition-colors flex items-center justify-center mt-4 shadow-md shadow-blue-900/20 disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "ĐĂNG KÝ NGAY"
                )}
              </button>
            </form>

            {/* Footer Form */}
            <div className="mt-6 text-center text-sm text-gray-700">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-[#1660b3] font-bold hover:underline transition-colors"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
        {/* --- HẾT CỘT PHẢI --- */}
      </div>
    </div>
  );
};

export default Register;
