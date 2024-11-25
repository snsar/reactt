import axiosClient from "./axiosClient";

const authApi = {
  login: (data) => {
    return axiosClient.post("/public/signin", data);
  },
  register: (data) => {
    return axiosClient.post("/public/signup", data);
  },
  forgotPassword: (email) => {
    return axiosClient.post("/public/forgot-password", { params: { email } });
  },
  verifyOtp: (email, otpCode) => {
    return axiosClient.post("/public/verify-otp", {
      params: { email, otpCode },
    });
  },
};

export default authApi;
