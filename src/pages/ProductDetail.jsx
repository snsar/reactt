import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { motion } from 'framer-motion';
import AddToCart from '../components/product/AddToCart';
import ProductReviews from '../components/product/ProductReviews';
import productApi from '../api/productApi';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedTab, setSelectedTab] = useState('description');

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

  // Tạo mảng hình ảnh từ sản phẩm
  const productImages = [product.imageUrl, ...(product.images || [])];

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
          <Swiper
            spaceBetween={10}
            navigation={true}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="aspect-square rounded-lg overflow-hidden bg-white"
          >
            {productImages.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`${product.name} - ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="thumbs-swiper"
          >
            {productImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="aspect-square rounded-lg overflow-hidden bg-white cursor-pointer">
                  <img
                    src={image}
                    alt={`${product.name} - thumbnail ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-gray-500">
                Đã bán: {product.sold || 0}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {product.discount > 0 ? (
                <>
                  <div className="flex items-center gap-4">
                    <p className="text-2xl text-primary font-bold">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price * (1 - product.discount/100))}
                    </p>
                    <span className="px-2 py-1 bg-red-500 text-white rounded-lg text-sm">
                      -{product.discount}%
                    </span>
                  </div>
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
          </motion.div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${product.importQuantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className={product.importQuantity > 0 ? 'text-green-500' : 'text-red-500'}>
              {product.importQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
            </span>
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
                <Link
                  to={`/products?brand=${product.brand?.id}`}
                  className="ml-2 font-medium hover:text-primary"
                >
                  {product.brand?.name}
                </Link>
              </div>
              <div>
                <span className="text-gray-600">Danh mục:</span>
                <span className="ml-2">
                  {product.categories?.map((cat, index) => (
                    <span key={cat.categoryId}>
                      <Link
                        to={`/products?category=${cat.categoryId}`}
                        className="font-medium hover:text-primary"
                      >
                        {cat.name}
                      </Link>
                      {index < product.categories.length - 1 && ', '}
                    </span>
                  ))}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Đã bán:</span>
                <span className="ml-2 font-medium">{product.sold}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="card bg-base-100 shadow-sm mb-12">
        <div className="card-body">
          <div className="tabs tabs-boxed">
            <button
              className={`tab ${selectedTab === 'description' ? 'tab-active' : ''}`}
              onClick={() => setSelectedTab('description')}
            >
              Mô tả sản phẩm
            </button>
            <button
              className={`tab ${selectedTab === 'specs' ? 'tab-active' : ''}`}
              onClick={() => setSelectedTab('specs')}
            >
              Thông số kỹ thuật
            </button>
            <button
              className={`tab ${selectedTab === 'reviews' ? 'tab-active' : ''}`}
              onClick={() => setSelectedTab('reviews')}
            >
              Đánh giá
            </button>
          </div>

          <div className="mt-6">
            {selectedTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {selectedTab === 'specs' && (
              <div className="overflow-x-auto">
                <table className="table">
                  <tbody>
                    {product.specifications?.map((spec, index) => (
                      <tr key={index}>
                        <td className="font-medium w-1/3">{spec.name}</td>
                        <td>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <ProductReviews
                productId={Number(id)}
                isVisible={selectedTab === 'reviews'}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;