import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product.productId, quantity: 1 }));
  };

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure>
        <img src={product.imageUrl} alt={product.name} className="h-48 w-full object-cover" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{product.name}</h2>
        <div className="flex justify-between items-center">
          <div>
            {product.promotePrice ? (
              <>
                <span className="text-xl font-bold text-primary">{product.promotePrice.toLocaleString()}đ</span>
                <span className="text-sm line-through ml-2">{product.price.toLocaleString()}đ</span>
              </>
            ) : (
              <span className="text-xl font-bold">{product.price.toLocaleString()}đ</span>
            )}
          </div>
          {product.discount > 0 && (
            <div className="badge badge-secondary">-{product.discount}%</div>
          )}
        </div>
        <div className="card-actions justify-end mt-4">
          <Link to={`/products/${product.productId}`} className="btn btn-outline btn-primary">
            Chi tiết
          </Link>
          <button className="btn btn-primary" onClick={handleAddToCart}>
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    productId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    promotePrice: PropTypes.number,
    discount: PropTypes.number,
    imageUrl: PropTypes.string.isRequired
  }).isRequired
};

export default ProductCard;