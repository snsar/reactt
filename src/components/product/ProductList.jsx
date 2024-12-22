import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';

function ProductList() {
  const { items, isLoading, error } = useSelector((state) => state.products);

  if (isLoading) {
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  );
}

export default ProductList;