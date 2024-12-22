import { createSlice } from "@reduxjs/toolkit";

// Lấy giỏ hàng từ localStorage nếu có
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : { items: [], totalAmount: 0 };
  } catch (error) {
    console.error("Error loading cart from storage:", error);
    return { items: [], totalAmount: 0 };
  }
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }

      state.totalAmount = state.items.reduce(
        (total, item) =>
          total + item.price * (1 - (item.discount || 0) / 100) * item.quantity,
        0
      );

      // Lưu vào localStorage
      localStorage.setItem("cart", JSON.stringify(state));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
        state.totalAmount = state.items.reduce(
          (total, item) =>
            total +
            item.price * (1 - (item.discount || 0) / 100) * item.quantity,
          0
        );
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      state.totalAmount = state.items.reduce(
        (total, item) =>
          total + item.price * (1 - (item.discount || 0) / 100) * item.quantity,
        0
      );
      localStorage.setItem("cart", JSON.stringify(state));
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
