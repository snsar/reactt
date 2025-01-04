import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import productApi from '../../api/productApi';
import 'swiper/css';
import 'swiper/css/navigation';

function RelatedProducts({ categoryIds, currentProductId, limit }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setIsLoading(true);
        // Chỉ gọi API khi có categoryIds
        if (categoryIds && categoryIds.length > 0) {
          const response = await productApi.getRelatedProducts(categoryIds, currentProductId, limit);
          setProducts(response);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categoryIds, currentProductId, limit]);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <Swiper
      modules={[Navigation]}
      spaceBetween={24}
      slidesPerView={1}
      navigation
      breakpoints={{
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        }
      }}
    >
      {products.map((product) => (
        <SwiperSlide key={product.id}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard product={product} showDiscount={true} />
          </motion.div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default RelatedProducts;