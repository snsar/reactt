import { useState } from 'react';
import { toast } from 'react-toastify';
import cartApi from '../../api/cartApi';

function AddToCart({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > product.stockQuantity) {
      toast.warning(`Chỉ còn ${product.stockQuantity} sản phẩm trong kho`);
      return;
    }
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      await cartApi.addToCart(product.productId, quantity);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            className="btn btn-sm btn-square"
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
            className="btn btn-sm btn-square"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= product.stockQuantity || isAdding}
          >
            +
          </button>
        </div>

        <button
          className="btn btn-primary flex-1"
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
              <i className="fas fa-shopping-cart mr-2"></i>
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
  );
}

export default AddToCart;