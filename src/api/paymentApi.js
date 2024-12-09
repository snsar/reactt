import axiosClient from './axiosClient';

const paymentApi = {
  createPaymentOrder: (amount) => {
    return axiosClient.post('/public/create-order', null, {
      params: { amount }
    });
  },

  getVnPayUrl: () => {
    return axiosClient.get('/public/vn-pay');
  },

  handleVnPayCallback: () => {
    return axiosClient.get('/public/vn-pay-callback');
  }
};

export default paymentApi; 