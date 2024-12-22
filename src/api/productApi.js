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

  searchByKeyword: (keyword, params) => {
    return axiosClient.get("/public/products/search-by-keyword", {
      params: { ...params, keyword },
    });
  },

  getByCategory: (categoryId, params) => {
    return axiosClient.get(`/public/products/categories/${categoryId}`, {
      params,
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
