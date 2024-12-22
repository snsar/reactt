import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartApi from "../../api/cartApi";
import { toast } from "react-toastify";

// Async thunk để lấy giỏ hàng từ server
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const response = await cartApi.getCart();
  return response.data;
});

// Async thunk để thêm sản phẩm vào giỏ hàng
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }) => {
    const response = await cartApi.addItem(productId, quantity);
    return response.data;
  }
);

// Async thunk để cập nhật số lượng sản phẩm
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }) => {
    const response = await cartApi.updateQuantity(productId, quantity);
    return response.data;
  }
);

// Async thunk để xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId) => {
    await cartApi.removeItem(productId);
    return productId;
  }
);

// Async thunk để xóa toàn bộ giỏ hàng
export const clearCart = createAsyncThunk("cart/clearCart", async () => {
  await cartApi.clearCart();
  return [];
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        toast.success("Đã thêm sản phẩm vào giỏ hàng");
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        toast.error("Không thể thêm sản phẩm vào giỏ hàng");
      })
      // Update quantity
      .addCase(updateQuantity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        toast.error("Không thể cập nhật số lượng sản phẩm");
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(
          (item) => item.productId !== action.payload
        );
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        toast.error("Không thể xóa sản phẩm khỏi giỏ hàng");
      })
      // Clear cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default cartSlice.reducer;
