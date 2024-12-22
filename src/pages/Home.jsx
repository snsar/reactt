import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { motion } from 'framer-motion';
import ProductCard from '../components/product/ProductCard';

function Home() {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((state) => state.products);
  const { categories, isLoading: categoriesLoading } = useSelector((state) => state.categories);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (items.length > 0) {
      const filtered = items.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const price = product.price;
        const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
        return matchesSearch && matchesPrice;
      });
      setFilteredProducts(filtered);
    }
  }, [items, searchTerm, priceRange]);

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6',
      title: 'Công nghệ hiện đại',
      description: 'Khám phá các sản phẩm công nghệ mới nhất với chất lượng tốt nhất'
    },
    {
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661',
      title: 'Thiết bị thông minh',
      description: 'Trải nghiệm cuộc sống thông minh với các thiết bị hiện đại'
    },
    {
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      title: 'Giải pháp số',
      description: 'Tìm kiếm giải pháp công nghệ phù hợp cho nhu cầu của bạn'
    }
  ];

  // Lấy sản phẩm mới nhất (6 sản phẩm)
  const newProducts = [...items]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  // Lấy sản phẩm giảm giá (6 sản phẩm)
  const discountedProducts = items
    .filter(product => product.discount > 0)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 6);

  return (
    <div className="space-y-12">
      {/* Hero Section with Swiper */}
      <section className="min-h-[70vh]">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          pagination={{ clickable: true }}
          navigation
          autoplay={{ delay: 5000 }}
          className="h-[70vh]"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div 
                className="hero min-h-[70vh]" 
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="hero-overlay bg-opacity-60"></div>
                <div className="hero-content text-center text-neutral-content">
                  <motion.div 
                    className="max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h1 className="mb-5 text-5xl font-bold">{slide.title}</h1>
                    <p className="mb-5 text-lg">{slide.description}</p>
                    <Link to="/products" className="btn btn-primary btn-lg">
                      <i className="fas fa-shopping-cart mr-2"></i>
                      Mua sắm ngay
                    </Link>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="w-full md:w-1/2">
              <div className="form-control">
                <div className="input-group">
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm sản phẩm..." 
                    className="input input-bordered w-full" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn btn-square btn-primary">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Giá:</span>
                <input 
                  type="range" 
                  min="0" 
                  max="100000000" 
                  value={priceRange[1]} 
                  className="range range-primary" 
                  step="1000000"
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                />
                <span className="text-sm font-medium">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange[1])}
                </span>
              </div>
            </div>
          </div>
          
          {/* Hiển thị số lượng sản phẩm tìm thấy */}
          {searchTerm && (
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Tìm thấy {filteredProducts.length} sản phẩm cho từ khóa "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Danh mục sản phẩm
          </motion.h2>
          {categoriesLoading ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.categoryId}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/products?category=${category.categoryId}`}>
                    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                        {category.imageUrl ? (
                          <img 
                            src={category.imageUrl} 
                            alt={category.name} 
                            className="w-10 h-10 object-contain"
                          />
                        ) : (
                          <i className="fas fa-box text-2xl"></i>
                        )}
                      </div>
                      <span className="mt-4 font-medium text-center group-hover:text-primary transition-colors duration-300">
                        {category.name}
                      </span>
                      {category.description && (
                        <p className="mt-2 text-sm text-gray-500 text-center line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Products Section */}
      <section className="py-12 bg-base-200">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Sản phẩm mới nhất</h2>
            <p className="text-gray-600">Khám phá những sản phẩm mới nhất của chúng tôi</p>
          </motion.div>
          
          {isLoading ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newProducts.map((product) => (
                <motion.div
                  key={product.productId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} showDiscount={true} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Discounted Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Sản phẩm giảm giá</h2>
            <p className="text-gray-600">Không thể bỏ lỡ những ưu đãi hấp dẫn</p>
          </motion.div>
          
          {isLoading ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {discountedProducts.map((product) => (
                <motion.div
                  key={product.productId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-lg z-10">
                      -{product.discount}%
                    </div>
                    <ProductCard product={product} showDiscount={true} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Xem thêm button */}
          <div className="text-center mt-8">
            <Link 
              to="/products?discount=true" 
              className="btn btn-outline btn-primary"
            >
              <i className="fas fa-tag mr-2"></i>
              Xem thêm sản phẩm giảm giá
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Updated with better visuals */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="card-body items-center text-center">
                <div className="text-primary text-5xl mb-4 transform transition-transform duration-300 hover:scale-110">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3 className="card-title text-xl mb-2">Chất lượng đảm bảo</h3>
                <p className="text-gray-600">Cam kết chính hãng 100% với đầy đủ phụ kiện và bảo hành</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="card-body items-center text-center">
                <div className="text-primary text-5xl mb-4 transform transition-transform duration-300 hover:scale-110">
                  <i className="fas fa-truck"></i>
                </div>
                <h3 className="card-title text-xl mb-2">Giao hàng nhanh chóng</h3>
                <p className="text-gray-600">Giao hàng trong vòng 24h với đơn hàng nội thành</p>
              </div>
            </motion.div>

            <motion.div 
              className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="card-body items-center text-center">
                <div className="text-primary text-5xl mb-4 transform transition-transform duration-300 hover:scale-110">
                  <i className="fas fa-headset"></i>
                </div>
                <h3 className="card-title text-xl mb-2">Hỗ trợ 24/7</h3>
                <p className="text-gray-600">Đội ngũ tư vấn viên luôn sẵn sàng hỗ trợ bạn</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Đăng ký nhận tin</h2>
            <p className="text-gray-600 mb-8">
              Đăng ký để nhận thông tin về sản phẩm mới và khuyến mãi hấp dẫn
            </p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center">
              <input 
                type="email" 
                placeholder="Nhập email của bạn" 
                className="input input-bordered w-full max-w-md" 
              />
              <button className="btn btn-primary">
                <i className="fas fa-paper-plane mr-2"></i>
                Đăng ký
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;