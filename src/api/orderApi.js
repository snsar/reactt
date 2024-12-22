import axiosClient from "./axiosClient";

const orderApi = {
  create: (cartId, paymentMethod) => {
    return axiosClient.post(`/public/order-product/${cartId}/${paymentMethod}`);
  },

  getUserOrders: () => {
    return axiosClient.get("/public/orders/user");
  },

  getOrderById: (orderId) => {
    return axiosClient.get(`/public/orders/${orderId}`);
  },

  getOrderDetails: (orderId) => {
    return axiosClient.get(`/public/orders/${orderId}/details`);
  },

  cancelOrder: (orderId) => {
    return axiosClient.post(`/public/orders/${orderId}/cancel`);
  },

  verifyPayment: (orderId, params) => {
    return axiosClient.get(`/public/orders/${orderId}/payment/verify`, {
      params,
    });
  },
};

export default orderApi;
