import axiosClient from "./axiosClient";

export const commentApi = {
  // Lấy danh sách comment của sản phẩm
  getProductComments: (productId, page = 0, size = 10) => {
    return axiosClient
      .get(`/public/products/${productId}/comments`, {
        params: { page, size },
      })
      .then((response) => response.data);
  },

  // Lấy điểm đánh giá trung bình
  getAverageRating: (productId) => {
    return axiosClient.get(`/public/average-rating/${productId}`);
  },

  // Thêm comment mới
  addComment: (data) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    return axiosClient
      .post("/public/add-comment", data, config)
      .then((response) => response.data);
  },

  // Xóa comment
  deleteComment: (commentId) => {
    return axiosClient
      .delete(`/public/comments/${commentId}`)
      .then((response) => response.data);
  },
};
