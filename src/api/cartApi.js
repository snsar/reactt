import axiosClient from "./axiosClient";

const cartApi = {
  viewCart: () => {
    return axiosClient.get("/public/view-cart");
  },

  addToCart: (productId, quantity) => {
    return axiosClient.post(
      `/public/add-product-to-cart/${productId}?quantity=${quantity}`
    );
  },

  updateQuantity: (cartItemData) => {
    return axiosClient.put(
      "/public/carts/update-product-quantity",
      cartItemData
    );
  },

  deleteCartItem: (cartId, productId) => {
    return axiosClient.delete(
      `/public/carts/delete-cart-item/${cartId}/${productId}`
    );
  },
};

export default cartApi;
