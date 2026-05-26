import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // useLocation sẽ lấy ra đường dẫn hiện tại (ví dụ: /cart, /shop, /product/123)
  const { pathname } = useLocation();

  useEffect(() => {
    // Mỗi khi pathname thay đổi, tự động cuộn lên đầu
    window.scrollTo(0, 0);
  }, [pathname]);

  // Component này không hiển thị ra giao diện (tàng hình)
  return null;
};

export default ScrollToTop;
