import axiosClient from "./axiosClient";

const productApi = {
  getAll: (page = 0, size = 20) => {
    return axiosClient.get("/public/products", {
      params: { page, size },
    });
  },

  getById: (id) => {
    return axiosClient.get(`/public/product/${id}`);
  },

  getDiscounted: () => {
    return axiosClient.get("/public/products/discounted");
  },

  searchByKeyword: (keyword) => {
    return axiosClient.get("/public/products/search-by-keyword", {
      params: { keyword },
    });
  },
};

export default productApi;
