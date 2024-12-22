import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalAmount: 0,
    cartId: null,
  },
  reducers: {
    setCartItems: (state, action) => {
      const cart = action.payload[0];
      if (cart) {
        state.cartId = cart.cartId;
        state.items = cart.products.map((product) => ({
          id: product.productId,
          cartId: cart.cartId,
          name: product.name,
          price: product.price,
          promotePrice: product.promotePrice,
          image: product.imageUrl,
          quantity: product.stockQuantity,
          stockQuantity: product.availableStock,
          discount: product.discount || 0,
        }));
        state.totalAmount = state.items.reduce((total, item) => {
          const price =
            item.discount > 0
              ? item.price * (1 - item.discount / 100)
              : item.price;
          return total + price * item.quantity;
        }, 0);
      }
    },
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push({
          ...newItem,
          cartId: state.cartId,
        });
      }
      state.totalAmount = state.items.reduce((total, item) => {
        const price =
          item.discount > 0
            ? item.price * (1 - item.discount / 100)
            : item.price;
        return total + price * item.quantity;
      }, 0);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
        state.totalAmount = state.items.reduce((total, item) => {
          const price =
            item.discount > 0
              ? item.price * (1 - item.discount / 100)
              : item.price;
          return total + price * item.quantity;
        }, 0);
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.totalAmount = state.items.reduce((total, item) => {
        const price =
          item.discount > 0
            ? item.price * (1 - item.discount / 100)
            : item.price;
        return total + price * item.quantity;
      }, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.cartId = null;
    },
  },
});

export const {
  setCartItems,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
