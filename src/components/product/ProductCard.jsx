import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleAddToCart = () => {
    if (!user) {
      toast.warning('Vui lòng đăng nhập để mua hàng');
      return;
    }
    dispatch(addToCart({ productId: product.productId, quantity: 1 }));
    toast.success('Đã thêm sản phẩm vào giỏ hàng');
  };

  const calculateDiscount = (original, discounted) => {
    return Math.round(((original - discounted) / original) * 100);
  };

  const discountPercent = product.promotePrice ? calculateDiscount(product.price, product.promotePrice) : 0;

  return (
    <Link to={`/products/${product.productId}`}>
      <motion.div 
        className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 h-full"
        whileHover={{ y: -5 }}
      >
        <figure className="relative pt-[100%] overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
          />
          {discountPercent > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
              -{discountPercent}%
            </div>
          )}
          {product.availableStock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-lg font-bold">Hết hàng</span>
            </div>
          )}
        </figure>

        <div className="card-body p-4">
          <h2 className="text-lg font-semibold line-clamp-2 min-h-[3rem] hover:text-primary transition-colors duration-300">
            {product.name}
          </h2>

          <div className="mt-2">
            <div className="flex flex-col">
              {discountPercent > 0 ? (
                <>
                  <span className="text-xl font-bold text-primary">
                    {product.promotePrice.toLocaleString()}đ
                  </span>
                  <span className="text-sm line-through text-gray-500">
                    {product.price.toLocaleString()}đ
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-primary">
                  {product.price.toLocaleString()}đ
                </span>
              )}
            </div>

            <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <i className="fas fa-box"></i>
                <span>{product.availableStock} có sẵn</span>
              </div>
              <div className="flex items-center gap-1">
                <i className="fas fa-shopping-cart"></i>
                <span>Đã bán {product.sold}</span>
              </div>
            </div>
          </div>

          <motion.button 
            className={`btn mt-4 w-full ${product.availableStock === 0 ? 'btn-disabled' : 'btn-primary'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault();
              if (product.availableStock > 0) {
                handleAddToCart();
              }
            }}
          >
            <i className="fas fa-cart-plus mr-2"></i>
            {product.availableStock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
          </motion.button>
        </div>
      </motion.div>
    </Link>
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