import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
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

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

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

  const categories = [
    {
      id: 1,
      name: 'Điện thoại',
      icon: 'fas fa-mobile-alt',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Laptop',
      icon: 'fas fa-laptop',
      color: 'bg-red-500'
    },
    {
      id: 3,
      name: 'Máy tính bảng',
      icon: 'fas fa-tablet-alt',
      color: 'bg-green-500'
    },
    {
      id: 4,
      name: 'Phụ kiện',
      icon: 'fas fa-headphones',
      color: 'bg-purple-500'
    },
    {
      id: 5,
      name: 'Smart Home',
      icon: 'fas fa-home',
      color: 'bg-yellow-500'
    },
    {
      id: 6,
      name: 'Gaming',
      icon: 'fas fa-gamepad',
      color: 'bg-pink-500'
    }
  ];

  return (
    <div className="space-y-16">
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

      {/* Categories Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Danh mục sản phẩm
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className={`w-20 h-20 rounded-full ${category.color} text-white flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${category.icon} text-3xl`}></i>
                  </div>
                  <span className="font-medium text-center">{category.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Sản phẩm nổi bật</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá những sản phẩm công nghệ hàng đầu với chất lượng vượt trội và giá cả hợp lý
            </p>
          </motion.div>
          
          {isLoading ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <Swiper
              modules={[Pagination, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                }
              }}
              className="pb-12"
            >
              {items.slice(0, 6).map((product) => (
                <SwiperSlide key={product.productId}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          <div className="text-center mt-8">
            <Link 
              to="/products" 
              className="btn btn-outline btn-primary btn-lg"
            >
              <i className="fas fa-th-list mr-2"></i>
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
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
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
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
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="card-body items-center text-center">
                <div className="text-primary text-5xl mb-4 transform transition-transform duration-300 hover:scale-110">
                  <i className="fas fa-sync"></i>
                </div>
                <h3 className="card-title text-xl mb-2">Đổi trả miễn phí</h3>
                <p className="text-gray-600">Đổi trả sản phẩm trong vòng 7 ngày nếu có lỗi từ nhà sản xuất</p>
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