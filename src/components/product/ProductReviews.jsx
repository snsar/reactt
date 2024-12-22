import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Rating } from 'react-simple-star-rating';
import productApi from '../../api/productApi';
import { useNavigate, Link } from 'react-router-dom';
import Toast from '../common/Toast';

function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [toast, setToast] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
    if (user) {
      checkReviewPermission();
    }
  }, [productId, user]);

  const checkReviewPermission = async () => {
    try {
      const response = await productApi.canReviewProduct(productId);
      setCanReview(response.data.canReview);
    } catch (error) {
      console.error('Failed to check review permission:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await productApi.getComments(productId);
      setReviews(response.data);
      if (response.data.length > 0) {
        const avgRating = response.data.reduce((acc, review) => acc + review.rating, 0) / response.data.length;
        setRating(avgRating);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      setToast({
        type: 'warning',
        message: 'Vui lòng đăng nhập để đánh giá sản phẩm'
      });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (!canReview) {
      setToast({
        type: 'warning',
        message: 'Bạn cần mua sản phẩm này trước khi đánh giá'
      });
      return;
    }

    if (!rating) {
      setToast({
        type: 'warning',
        message: 'Vui lòng chọn số sao đánh giá'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await productApi.addComment(productId, {
        rating,
        content: comment
      });
      setComment('');
      setToast({
        type: 'success',
        message: 'Đã gửi đánh giá thành công'
      });
      fetchReviews();
      setCanReview(false);
    } catch (error) {
      console.error('Failed to submit review:', error);
      setToast({
        type: 'error',
        message: 'Không thể gửi đánh giá. Vui lòng thử lại sau.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Đánh giá sản phẩm</h2>

      {/* Overall Rating */}
      <div className="flex items-center space-x-4 mb-8">
        <Rating
          initialValue={rating}
          size={24}
          allowFraction
          readonly
        />
        <span className="text-lg">
          {rating.toFixed(1)} / 5
        </span>
        <span className="text-gray-500">
          ({reviews.length} đánh giá)
        </span>
      </div>

      {/* Review Form */}
      {user ? (
        canReview ? (
          <form onSubmit={handleSubmitReview} className="mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Đánh giá của bạn
                </label>
                <Rating
                  onClick={(rate) => setRating(rate)}
                  size={24}
                  allowFraction
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nhận xét
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="textarea textarea-bordered w-full"
                  rows="3"
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Đang gửi...
                  </>
                ) : (
                  'Gửi đánh giá'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="alert alert-info mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Bạn cần mua sản phẩm này trước khi có thể đánh giá</span>
          </div>
        )
      ) : (
        <div className="alert alert-warning mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Vui lòng <Link to="/login" className="font-medium underline">đăng nhập</Link> để đánh giá sản phẩm</span>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-4">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-8">
                      <span className="text-xs">{review.user.name[0]}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">{review.user.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                <Rating
                  initialValue={review.rating}
                  size={16}
                  allowFraction
                  readonly
                />
              </div>
              <p className="text-gray-600">{review.content}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            Chưa có đánh giá nào cho sản phẩm này
          </p>
        )}
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default ProductReviews; 