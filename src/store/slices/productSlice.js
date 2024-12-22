import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productApi from "../../api/productApi";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await productApi.getAll(page, size);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
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
      return rejectWithValue(error.response.data);
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setSize } = productSlice.actions;

export default productSlice.reducer;
