import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import productApi from '../../api/productApi';
import 'swiper/css';
import 'swiper/css/navigation';

function RelatedProducts({ categoryIds, currentProductId }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setIsLoading(true);
        // Gọi API để lấy sản phẩm liên quan dựa trên categoryIds
        const response = await productApi.getRelated({
          categoryIds,
          currentProductId,
          limit: 6
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch related products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryIds?.length > 0) {
      fetchRelatedProducts();
    }
  }, [categoryIds, currentProductId]);

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