import axiosClient from "./axiosClient";

const cartApi = {
  getCart: () => {
    return axiosClient.get("/public/cart");
  },

  addItem: (productId, quantity) => {
    return axiosClient.post("/public/cart/add", { productId, quantity });
  },

  updateQuantity: (productId, quantity) => {
    return axiosClient.put("/public/cart/update", { productId, quantity });
  },

  removeItem: (productId) => {
    return axiosClient.delete(`/public/cart/remove/${productId}`);
  },

  clearCart: () => {
    return axiosClient.delete("/public/cart/clear");
  },
};

export default cartApi;
