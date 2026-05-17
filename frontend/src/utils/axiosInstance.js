import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Đường dẫn gốc tới API Backend của bạn
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Bộ cấu hình tự động chèn Token vào Header trước khi request bay đi
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token được lưu trong localStorage sau khi đăng nhập thành công
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
