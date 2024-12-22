import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Rating } from 'react-simple-star-rating';
import productApi from '../../api/productApi';

function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await productApi.getComments(productId);
      setReviews(response.data);
      // Calculate average rating
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
      alert('Vui lòng đăng nhập để đánh giá sản phẩm');
      return;
    }
    if (!rating) {
      alert('Vui lòng chọn số sao đánh giá');
      return;
    }
    try {
      setIsSubmitting(true);
      await productApi.addComment(productId, {
        rating,
        content: comment
      });
      setComment('');
      fetchReviews();
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Không thể gửi đánh giá. Vui lòng thử lại sau.');
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
    </div>
  );
}

export default ProductReviews; 