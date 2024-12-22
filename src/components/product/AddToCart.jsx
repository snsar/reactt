import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import Toast from '../common/Toast';

function AddToCart({ product }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState(null);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > product.stockQuantity) return;
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      
      // Thêm animation cho icon giỏ hàng
      const cartIcon = document.querySelector('.cart-icon');
      if (cartIcon) {
        cartIcon.classList.add('animate-bounce');
        setTimeout(() => {
          cartIcon.classList.remove('animate-bounce');
        }, 1000);
      }

      dispatch(addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity
      }));

      setToast({
        type: 'success',
        message: 'Đã thêm sản phẩm vào giỏ hàng'
      });
      
      // Reset quantity về 1 sau khi thêm thành công
      setQuantity(1);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Không thể thêm sản phẩm vào giỏ hàng'
      });
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              className="btn btn-square btn-sm"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isAdding}
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
              className="input input-bordered w-20 text-center"
              min="1"
              max={product.stockQuantity}
            />
            <button
              className="btn btn-square btn-sm"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stockQuantity || isAdding}
            >
              +
            </button>
          </div>
          
          <button
            className="btn btn-primary flex-1 relative"
            onClick={handleAddToCart}
            disabled={isAdding || product.stockQuantity === 0}
          >
            {isAdding ? (
              <>
                <span className="loading loading-spinner"></span>
                <span className="ml-2">Đang thêm...</span>
              </>
            ) : product.stockQuantity === 0 ? (
              'Hết hàng'
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Thêm vào giỏ
              </>
            )}
          </button>
        </div>

        {product.stockQuantity > 0 && (
          <p className="text-sm text-gray-600">
            Còn {product.stockQuantity} sản phẩm
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
    </>
  );
}

export default AddToCart; 