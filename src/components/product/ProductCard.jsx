import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { motion } from 'framer-motion';

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product.productId, quantity: 1 }));
  };

  return (
    <motion.div 
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      <figure className="relative overflow-hidden pt-[60%]">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
        />
        {product.discount > 0 && (
          <div className="absolute top-4 right-4 badge badge-secondary text-lg p-3">
            -{product.discount}%
          </div>
        )}
      </figure>
      <div className="card-body">
        <Link to={`/products/${product.productId}`}>
          <h2 className="card-title hover:text-primary transition-colors duration-300">
            {product.name}
          </h2>
        </Link>
        <div className="flex flex-col gap-2">
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
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <i className="fas fa-box"></i>
            <span>Còn {product.availableStock} sản phẩm</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <i className="fas fa-shopping-cart"></i>
            <span>Đã bán {product.sold}</span>
          </div>
        </div>
        <div className="card-actions justify-end mt-4">
          <motion.button 
            className="btn btn-outline btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = `/products/${product.productId}`}
          >
            <i className="fas fa-info-circle mr-2"></i>
            Chi tiết
          </motion.button>
          <motion.button 
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
          >
            <i className="fas fa-cart-plus mr-2"></i>
            Thêm vào giỏ
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
  }).isRequired,
};

export default ProductCard;