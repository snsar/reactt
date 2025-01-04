import axiosClient from "./axiosClient";

const productApi = {
  getAll: (params) => {
    return axiosClient.get("/public/products", { params });
  },

  getById: (id) => {
    return axiosClient.get(`/public/product/${id}`);
  },

  getRelated: ({ categoryIds, currentProductId, limit = 6 }) => {
    return axiosClient.get("/public/products/related", {
      params: {
        categoryIds: categoryIds.join(","),
        currentProductId,
        limit,
      },
    });
  },

  searchByKeyword: (keyword) => {
    return axiosClient.get("/public/products/search-by-keyword", {
      params: { keyword },
    });
  },

  getByCategory: (categoryId, params) => {
    return axiosClient.get("/public/products", {
      params: { ...params, categoryId },
    });
  },

  getDiscounted: () => {
    return axiosClient.get("/public/products/discounted");
  },

  getComments: (productId) => {
    return axiosClient.get(`/public/products/${productId}/comments`);
  },

  addComment: (productId, data) => {
    return axiosClient.post(`/products/${productId}/comments`, data);
  },
};

export default productApi;
