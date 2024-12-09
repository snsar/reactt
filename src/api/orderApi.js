import axiosClient from './axiosClient';

const orderApi = {
  createOrder: (cartId, paymentMethod) => {
    return axiosClient.post(`/public/order-product/${cartId}/${paymentMethod}`);
  },

  getUserOrders: () => {
    return axiosClient.get('/public/orders/user');
  },

  getOrderById: (orderId) => {
    return axiosClient.get(`/public/orders/${orderId}`);
  },

  getOrderDetails: (orderId) => {
    return axiosClient.get(`/public/orders/${orderId}/details`);
  }
};

export default orderApi; 