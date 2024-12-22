import axiosClient from "./axiosClient";

const orderApi = {
  create: (orderData) => {
    return axiosClient.post("/public/orders", orderData);
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
