import axiosClient from "./axiosClient";

const productApi = {
  getAll: () => {
    return axiosClient.get("/public/products");
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
