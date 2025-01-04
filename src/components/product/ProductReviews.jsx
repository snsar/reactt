import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { commentApi } from '../../api/commentApi';
import { toast } from 'react-toastify';

const ProductReviews = ({ productId, isVisible }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isVisible && !isLoaded) {
      fetchComments();
      setIsLoaded(true);
    }
  }, [isVisible, productId, page]);

  const fetchComments = async () => {
    try {
      const response = await commentApi.getProductComments(productId, page);
      setComments(response.comments || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
      setTotalPages(0);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để đánh giá sản phẩm');
      return;
    }

    if (newComment.trim().length < 10) {
      toast.error('Nội dung đánh giá phải có ít nhất 10 ký tự');
      return;
    }

    try {
      const commentData = {
        productId,
        content: newComment.trim(),
        rating
      };

      await commentApi.addComment(commentData);
      toast.success('Đánh giá sản phẩm thành công');
      setNewComment('');
      setRating(5);
      fetchComments();
    } catch (err) {
      console.error('Error adding comment:', err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Có lỗi xảy ra khi đánh giá');
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentApi.deleteComment(commentId);
      toast.success('Xóa đánh giá thành công');
      fetchComments();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa đánh giá');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="card bg-base-100">
      <div className="card-body">
        {/* Form thêm đánh giá mới */}
        <div className="card bg-base-200 mb-6">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Viết đánh giá của bạn</h3>
            <form onSubmit={handleSubmitComment}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Đánh giá sao</span>
                </label>
                <div className="rating rating-lg">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <input
                      key={star}
                      type="radio"
                      name="rating"
                      className="mask mask-star-2 bg-orange-400"
                      checked={star === rating}
                      onChange={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Nội dung đánh giá</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  minLength={10}
                  maxLength={500}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Gửi đánh giá
              </button>
            </form>
          </div>
        </div>

        {/* Danh sách đánh giá */}
        {comments && comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.commentId} className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-8">
                            <span>{comment.user.userName[0].toUpperCase()}</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium">{comment.user.userName}</h3>
                          <div className="rating rating-sm">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <input
                                key={star}
                                type="radio"
                                className="mask mask-star-2 bg-orange-400"
                                checked={star <= comment.rating}
                                readOnly
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-600">{comment.content}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {new Date(comment.createdDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    {isAuthenticated && user.userName === comment.user.userName && (
                      <button
                        onClick={() => handleDeleteComment(comment.commentId)}
                        className="btn btn-ghost btn-sm text-error"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này</p>
          </div>
        )}

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="join grid grid-cols-2 w-full max-w-xs mx-auto mt-6">
            <button
              className="join-item btn btn-outline"
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              Trang trước
            </button>
            <button
              className="join-item btn btn-outline"
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
            >
              Trang sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

ProductReviews.propTypes = {
  productId: PropTypes.number.isRequired,
  isVisible: PropTypes.bool.isRequired
};

export default ProductReviews;