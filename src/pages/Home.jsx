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

  return (
    <div>
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
                    <p className="mb-5">{slide.description}</p>
                    <Link to="/products" className="btn btn-primary">Mua sắm ngay</Link>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Sản phẩm nổi bật
          </motion.h2>
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
            <Link to="/products" className="btn btn-outline btn-primary">
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="card-body items-center text-center">
                <div className="text-primary text-5xl mb-4">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3 className="card-title">Chất lượng đảm bảo</h3>
                <p>Cam kết chính hãng 100% với đầy đủ phụ kiện và bảo hành</p>
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
                <div className="text-primary text-5xl mb-4">
                  <i className="fas fa-truck"></i>
                </div>
                <h3 className="card-title">Giao hàng nhanh chóng</h3>
                <p>Giao hàng trong vòng 24h với đơn hàng nội thành</p>
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
                <div className="text-primary text-5xl mb-4">
                  <i className="fas fa-sync"></i>
                </div>
                <h3 className="card-title">Đổi trả miễn phí</h3>
                <p>Đổi trả sản phẩm trong vòng 7 ngày nếu có lỗi từ nhà sản xuất</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;