import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import productApi from '../api/productApi';

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productApi.getById(id);
        setProduct(response.data);
      } catch (err) {
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product.productId, quantity }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="alert alert-error">
        <span>Không tìm thấy sản phẩm</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div>
            {product.promotePrice ? (
              <div className="space-y-2">
                <span className="text-3xl font-bold text-primary">
                  {product.promotePrice.toLocaleString()}đ
                </span>
                <span className="text-xl line-through text-gray-500 ml-4">
                  {product.price.toLocaleString()}đ
                </span>
                {product.discount > 0 && (
                  <div className="badge badge-secondary">-{product.discount}%</div>
                )}
              </div>
            ) : (
              <span className="text-3xl font-bold">
                {product.price.toLocaleString()}đ
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <button 
                className="btn btn-square"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              >
                -
              </button>
              <span className="mx-4 text-xl">{quantity}</span>
              <button 
                className="btn btn-square"
                onClick={() => setQuantity(prev => prev + 1)}
              >
                +
              </button>
            </div>
            <button 
              className="btn btn-primary flex-1"
              onClick={handleAddToCart}
            >
              Thêm vào giỏ
            </button>
          </div>
          <div className="divider"></div>
          <div>
            <h2 className="text-xl font-bold mb-4">Thông tin sản phẩm</h2>
            <div className="space-y-2">
              <p><span className="font-semibold">Mã sản phẩm:</span> {product.productCode}</p>
              <p><span className="font-semibold">Thương hiệu:</span> {product.brand?.name}</p>
              <p><span className="font-semibold">Danh mục:</span> {product.categories?.map(cat => cat.name).join(', ')}</p>
              <p><span className="font-semibold">Số lượng còn:</span> {product.availableStock}</p>
              <p><span className="font-semibold">Đã bán:</span> {product.sold}</p>
            </div>
          </div>
          {product.description && (
            <div>
              <h2 className="text-xl font-bold mb-4">Mô tả sản phẩm</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail; 