import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product.productId, quantity: 1 }));
    toast.success('Đã thêm sản phẩm vào giỏ hàng');
  };

  const calculateDiscount = (original, discounted) => {
    return Math.round(((original - discounted) / original) * 100);
  };

  return (
    <motion.div 
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      <figure className="relative overflow-hidden pt-[60%] group">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        {product.promotePrice && (
          <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full font-semibold">
            -{calculateDiscount(product.price, product.promotePrice)}%
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Link 
            to={`/products/${product.productId}`}
            className="btn btn-primary btn-sm glass"
          >
            Xem chi tiết
          </Link>
        </div>
      </figure>

      <div className="card-body p-4">
        <Link to={`/products/${product.productId}`}>
          <h2 className="card-title text-lg hover:text-primary transition-colors duration-300 line-clamp-2">
            {product.name}
          </h2>
        </Link>

        <div className="mt-2 space-y-2">
          <div className="flex items-end gap-2">
            {product.promotePrice ? (
              <>
                <span className="text-2xl font-bold text-primary">
                  {product.promotePrice.toLocaleString()}đ
                </span>
                <span className="text-sm line-through text-gray-500">
                  {product.price.toLocaleString()}đ
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-primary">
                {product.price.toLocaleString()}đ
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <i className="fas fa-box"></i>
              <span>Còn {product.availableStock}</span>
            </div>
            <div className="flex items-center gap-1">
              <i className="fas fa-shopping-cart"></i>
              <span>Đã bán {product.sold}</span>
            </div>
          </div>

          {product.brand && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Thương hiệu:</span>
              <span className="font-medium">{product.brand.name}</span>
            </div>
          )}
        </div>

        <div className="card-actions justify-end mt-4">
          <motion.button 
            className="btn btn-primary w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={product.availableStock === 0}
          >
            <i className="fas fa-cart-plus mr-2"></i>
            {product.availableStock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    productId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    promotePrice: PropTypes.number,
    discount: PropTypes.number,
    imageUrl: PropTypes.string.isRequired,
    availableStock: PropTypes.number.isRequired,
    sold: PropTypes.number.isRequired,
    brand: PropTypes.shape({
      name: PropTypes.string.isRequired
    })
  }).isRequired,
};

export default ProductCard;