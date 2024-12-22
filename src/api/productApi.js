import axiosClient from "./axiosClient";

const productApi = {
  getAll: (params) => {
    return axiosClient.get("/public/products", { params });
  },

  getById: (id) => {
    return axiosClient.get(`/public/product/${id}`);
  },

  getByCategory: (categoryId, params) => {
    return axiosClient.get(`/public/products/categories/${categoryId}`, {
      params,
    });
  },

  searchByKeyword: (keyword, params) => {
    return axiosClient.get("/public/products/search-by-keyword", {
      params: { ...params, keyword },
    });
  },

  getDiscounted: (params) => {
    return axiosClient.get("/public/products/discounted", { params });
  },

  getComments: (productId) => {
    return axiosClient.get(`/public/products/${productId}/comments`);
  },

  addComment: (productId, data) => {
    return axiosClient.post(`/products/${productId}/comments`, data);
  },
};

export default productApi;
