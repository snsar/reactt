import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ProductList from '../components/product/ProductList';
import { searchProducts, fetchProducts } from '../store/slices/productSlice';

function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(searchProducts(searchTerm));
    } else {
      dispatch(fetchProducts());
    }
  };

  return (
    <div className="py-8">
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-4 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="input input-bordered flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Tìm kiếm
          </button>
        </form>
      </div>
      <ProductList />
    </div>
  );
}

export default Products;