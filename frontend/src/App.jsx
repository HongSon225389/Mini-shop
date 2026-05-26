import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/admin/Dashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import PlaceOrder from "./pages/PlaceOrder";
import OrderDetail from "./pages/OrderDetail";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <ScrollToTop />
        <Navbar />
        <main className="flex-grow max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Routes>
            {/* Các Route công khai (Ai cũng vào được) */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />

            {/* Các Route xác thực (Tự động đá về Home nếu đã đăng nhập) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Các Route cá nhân (Tự động đá ra Login nếu chưa đăng nhập) */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/order/:id" element={<OrderDetail />} />

            {/* Khu vực dành riêng cho Admin */}
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/orders" element={<OrderManagement />} />

            <Route path="/placeorder" element={<PlaceOrder />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
