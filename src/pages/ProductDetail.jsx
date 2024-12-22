import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import AddToCart from '../components/product/AddToCart';
import ProductReviews from '../components/product/ProductReviews';
import productApi from '../api/productApi';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        const response = await productApi.getById(id);
        setProduct(response.data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">{error}</h1>
        <Link to="/products" className="btn btn-primary">
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
        <Link to="/products" className="btn btn-primary">
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Breadcrumb */}
      <div className="text-sm breadcrumbs mb-8">
        <ul>
          <li><Link to="/">Trang chủ</Link></li>
          <li><Link to="/products">Sản phẩm</Link></li>
          <li>{product.name}</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-white">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain product-image"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="mt-4 space-y-2">
              {product.promotePrice ? (
                <>
                  <p className="text-2xl text-primary font-bold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.promotePrice)}
                  </p>
                  <p className="text-lg text-gray-500 line-through">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </p>
                </>
              ) : (
                <p className="text-2xl text-primary font-bold">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </p>
              )}
            </div>
          </div>

          {/* Add to Cart */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <AddToCart product={product} />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Mã sản phẩm:</span>
                <span className="ml-2 font-medium">{product.productCode}</span>
              </div>
              <div>
                <span className="text-gray-600">Thương hiệu:</span>
                <span className="ml-2 font-medium">{product.brand?.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Danh mục:</span>
                <span className="ml-2 font-medium">
                  {product.categories?.map(cat => cat.name).join(', ')}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Số lượng còn:</span>
                <span className="ml-2 font-medium">{product.importQuantity}</span>
              </div>
              <div>
                <span className="text-gray-600">Đã bán:</span>
                <span className="ml-2 font-medium">{product.sold}</span>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Mô tả sản phẩm</h2>
            <div className="prose max-w-none">
              <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <ProductReviews productId={id} />
        </div>
      </div>
    </div>
  );
}

export default ProductDetail; 