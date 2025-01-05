import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartId: null,
  totalPrice: 0,
  totalPriceAfterDiscount: 0,
  totalItems: 0,
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      const cart = action.payload[0];
      state.cartId = cart.cartId;
      state.totalPrice = cart.totalPrice;
      state.totalPriceAfterDiscount = cart.totalPriceAfterDiscount;
      state.totalItems = cart.totalItems;
      state.items = cart.items;
    },
    clearCart: (state) => {
      state.cartId = null;
      state.totalPrice = 0;
      state.totalPriceAfterDiscount = 0;
      state.totalItems = 0;
      state.items = [];
    },
  },
});

export const { setCartItems, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
