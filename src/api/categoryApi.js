import axiosClient from "./axiosClient";

const categoryApi = {
  getAll: () => {
    return axiosClient.get("/public/categories");
  },

  getById: (id) => {
    return axiosClient.get(`/public/categories/${id}`);
  },

  getProducts: (categoryId, params) => {
    return axiosClient.get(`/public/categories/${categoryId}/products`, {
      params,
    });
  },
};

export default categoryApi;
