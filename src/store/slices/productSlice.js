import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productApi from "../../api/productApi";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page = 0, size = 10, categoryId = null }, { rejectWithValue }) => {
    try {
      const params = { page, size };
      if (categoryId) {
        params.categoryId = categoryId;
      }
      const response = await productApi.getAll(params);
      return (
        response.data || {
          products: [],
          currentPage: 0,
          totalPages: 0,
          totalItems: 0,
          isFirst: true,
          isLast: true,
          hasNext: false,
          hasPrevious: false,
        }
      );
    } catch (error) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra");
    }
  }
);

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (keyword, { rejectWithValue }) => {
    try {
      const response = await productApi.searchByKeyword(keyword);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    page: 0,
    size: 10,
    totalPages: 0,
    totalItems: 0,
    isFirst: true,
    isLast: true,
    hasNext: false,
    hasPrevious: false,
    selectedCategory: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSize: (state, action) => {
      state.size = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.page = 0; // Reset page when changing category
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.products || [];
        state.page = action.payload.currentPage || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.totalItems = action.payload.totalItems || 0;
        state.isFirst = action.payload.isFirst;
        state.isLast = action.payload.isLast;
        state.hasNext = action.payload.hasNext;
        state.hasPrevious = action.payload.hasPrevious;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Có lỗi xảy ra";
        state.items = [];
      })
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.products || [];
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Có lỗi xảy ra";
        state.items = [];
      });
  },
});

export const { setPage, setSize, setSelectedCategory } = productSlice.actions;

export default productSlice.reducer;
