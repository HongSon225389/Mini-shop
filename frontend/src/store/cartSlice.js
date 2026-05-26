import { createSlice } from "@reduxjs/toolkit";

// Khởi tạo giỏ hàng từ localStorage (nếu có) để không bị mất
const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Hàm thêm sản phẩm vào giỏ
    addToCart: (state, action) => {
      const item = action.payload;
      // Kiểm tra xem sản phẩm đã có trong giỏ chưa
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // Nếu có rồi thì cập nhật lại số lượng
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x,
        );
      } else {
        // Nếu chưa có thì đẩy vào mảng
        state.cartItems = [...state.cartItems, item];
      }
      // Lưu lại vào trình duyệt
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // Hàm xóa 1 sản phẩm khỏi giỏ
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // Hàm xóa sạch giỏ hàng (dùng sau khi đặt hàng thành công)
    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const { addToCart, removeFromCart, clearCartItems } = cartSlice.actions;
export default cartSlice.reducer;
