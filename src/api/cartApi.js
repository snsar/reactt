import axiosClient from './axiosClient';

const cartApi = {
  viewCart: () => {
    return axiosClient.get('/public/view-cart');
  },

  addToCart: (productId, quantity) => {
    return axiosClient.post(`/public/add-product-to-cart/${productId}`, null, {
      params: { quantity }
    });
  },

  updateQuantity: (cartItemData) => {
    return axiosClient.put('/public/carts/update-product-quantity', cartItemData);
  },

  removeItem: (cartId, productId) => {
    return axiosClient.delete(`/public/carts/delete-cart-item/${cartId}/${productId}`);
  }
};

export default cartApi; 