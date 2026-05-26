import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Globe, Share2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="text-2xl font-bold text-blue-600 tracking-wider mb-4 block"
            >
              T1-SHOP
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Chuyên cung cấp các sản phẩm công nghệ, laptop, smartphone và
              thiết bị điện tử chính hãng với giá cả cạnh tranh nhất thị trường.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600 transition-colors"
                title="Website"
              >
                <Globe size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600 transition-colors"
                title="Chia sẻ"
              >
                <Share2 size={20} />
              </a>
            </div>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h3 className="text-gray-800 font-bold mb-4 uppercase text-sm tracking-wider">
              Liên kết nhanh
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
                >
                  Cửa hàng
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
                >
                  Giỏ hàng
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
                >
                  Hồ sơ cá nhân
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div>
            <h3 className="text-gray-800 font-bold mb-4 uppercase text-sm tracking-wider">
              Hỗ trợ khách hàng
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
                >
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
                >
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
                >
                  Hướng dẫn thanh toán
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
                >
                  Câu hỏi thường gặp (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h3 className="text-gray-800 font-bold mb-4 uppercase text-sm tracking-wider">
              Liên hệ
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start text-gray-500 text-sm">
                <MapPin
                  size={18}
                  className="mr-3 text-blue-600 shrink-0 mt-0.5"
                />
                <span>Trần Đại Nghĩa, ĐHBKHN, Hà Nội</span>
              </li>
              <li className="flex items-center text-gray-500 text-sm">
                <Phone size={18} className="mr-3 text-blue-600 shrink-0" />
                <span>0123 456 789</span>
              </li>
              <li className="flex items-center text-gray-500 text-sm">
                <Mail size={18} className="mr-3 text-blue-600 shrink-0" />
                <span>support@t1shop.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm text-center md:text-left mb-4 md:mb-0 font-medium">
            &copy; {new Date().getFullYear()} T1-SHOP. Thực hiện bởi Member 4.
          </p>

          <div className="flex space-x-4 items-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              alt="PayPal"
              className="h-5 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
              alt="Visa"
              className="h-4 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
              alt="Mastercard"
              className="h-5 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
