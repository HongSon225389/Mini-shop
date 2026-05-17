# 🛒 Hệ thống Thương mại Điện tử (T1-SHOP / Mini Shopee)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📝 Giới thiệu dự án

**T1-SHOP** là một hệ thống Website Thương mại điện tử Full-stack hiện đại. Dự án được xây dựng nhằm mang lại trải nghiệm mua sắm mượt mà cho khách hàng, đồng thời cung cấp một hệ sinh thái quản trị (Admin Dashboard) mạnh mẽ giúp chủ cửa hàng kiểm soát dòng tiền, đơn hàng và kho hàng một cách tối ưu nhất.

Hệ thống số hóa toàn bộ quy trình từ lúc khách hàng tìm kiếm sản phẩm, thêm vào giỏ hàng, đặt đơn, cho đến khi Admin duyệt đơn và xem báo cáo thống kê doanh thu.

## ✨ Tính năng nổi bật

- **🛍️ Cửa hàng thông minh:** Tìm kiếm sản phẩm theo từ khóa, lọc theo khoảng giá động (Dưới 10tr, 10-20tr...), sắp xếp (Mới nhất, Giá tăng/giảm) kết hợp phân trang tự động mượt mà.
- **🧑‍💻 Quản lý Hồ sơ bảo mật:** Cập nhật thông tin cá nhân, thay đổi mật khẩu 2 lớp (có kiểm tra so khớp trực tiếp), và theo dõi chi tiết lịch sử đơn hàng cá nhân.
- **📦 Quản lý Sản phẩm & Kho hàng (Admin):** Thêm/Sửa/Xóa sản phẩm với cơ chế chốt chặn Validation chặt chẽ (chống nhập giá 0 đồng, chống tồn kho âm).
- **📸 Upload Ảnh Thực tế (Multer):** Cho phép Admin tải trực tiếp hình ảnh sản phẩm từ máy tính lên Server nội bộ thay vì phải dùng link URL ngoài.
- **🔔 Thông báo Thời gian thực (Polling):** Hệ thống chuông báo đỏ nhấp nháy trên Navbar giúp Admin nhận biết ngay lập tức khi có đơn hàng mới đang chờ duyệt.
- **📊 Dashboard Thống kê (Admin):** Trực quan hóa dữ liệu với Biểu đồ doanh thu 6 tháng gần nhất, biểu đồ cơ cấu danh mục sản phẩm và theo dõi tỷ lệ trạng thái đơn hàng.

---

## 🛠 Công nghệ sử dụng

- **Frontend:** ReactJS (Vite), Tailwind CSS, Redux Toolkit (Quản lý State), React Router v6, Axios, Lucide React (Icons).
- **Backend:** Node.js, Express.js.
- **Cơ sở dữ liệu:** MongoDB Atlas (NoSQL), Mongoose.
- **Middleware & Bảo mật:** JSON Web Token (JWT) cho xác thực, BcryptJS mã hóa mật khẩu, Multer xử lý Upload file ảnh.

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy (Local Development)

Dự án được chia thành 2 phân hệ hoạt động độc lập: `frontend` và `backend`. Yêu cầu máy tính của bạn phải cài đặt sẵn **[Node.js](https://nodejs.org/)** (v16 trở lên) và có tài khoản **MongoDB Atlas**.

### Bước 1: Clone mã nguồn về máy

```bash
git clone [https://github.com/TenCuaBan/mini-shopee.git](https://github.com/TenCuaBan/mini-shopee.git)
cd mini-shopee
Bước 2: Thiết lập Backend (API Server)
Mở Terminal mới và di chuyển vào thư mục backend:

Bash
cd backend
npm install

Khởi chạy Backend Server:
Bash
npm run dev
Bước 3: Thiết lập Frontend (Client UI)
Mở một Terminal khác và di chuyển vào thư mục frontend:

Bash
cd frontend
npm install
Khởi chạy Frontend Server:

Bash
npm run dev
(Giao diện Web sẽ chạy tại: http://localhost:5173)

📂 Cấu trúc thư mục (Folder Structure)
Plaintext
mini-shopee/
├── backend/                # API Server & Database Models
│   ├── controllers/        # Xử lý logic nghiệp vụ (Product, Order, User)
│   ├── middlewares/        # Bảo mật JWT (Xác thực phân quyền Admin/Client)
│   ├── models/             # Schema cho MongoDB (Mongoose)
│   ├── routes/             # Định tuyến API endpoints (bao gồm uploadRoutes)
│   ├── uploads/            # (Tự tạo) Thư mục chứa file ảnh vật lý upload lên
│   └── server.js           # File khởi chạy server chính
│
└── frontend/               # ReactJS UI
    ├── src/
    │   ├── components/     # Các UI elements dùng chung (Navbar, ProductCard...)
    │   ├── pages/          # Các trang chức năng (Shop, Profile, Cart...)
    │   │   └── admin/      # Các trang dành riêng cho Ban quản trị
    │   ├── store/          # Redux Toolkit (authSlice, cartSlice...)
    │   ├── utils/          # Cấu hình Axios instance
    │   ├── App.jsx         # Cấu hình Router
    │   └── main.jsx        # Entry point của React
```
