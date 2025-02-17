import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderApi from "../../api/orderApi";

// Async thunk để tạo đơn hàng mới
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData) => {
    const response = await orderApi.create(orderData);
    return response.data;
  }
);

// Async thunk để lấy danh sách đơn hàng của user
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async () => {
    const response = await orderApi.getUserOrders();
    return response.data;
  }
);

// Async thunk để lấy chi tiết đơn hàng
export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (orderId) => {
    const response = await orderApi.getOrderById(orderId);
    return response.data;
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    items: [],
    currentOrder: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.items.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Fetch order by id
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;

export default orderSlice.reducer;
