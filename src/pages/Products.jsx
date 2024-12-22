import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductList from '../components/product/ProductList';
import { searchProducts, fetchProducts, setPage, setSize } from '../store/slices/productSlice';

function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const { page, size, totalPages, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ page, size }));
  }, [dispatch, page, size]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(searchProducts(searchTerm));
    } else {
      dispatch(fetchProducts({ page, size }));
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    dispatch(setSize(newSize));
    dispatch(setPage(0)); // Reset về trang đầu khi thay đổi size
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

      {/* Phân trang */}
      <div className="flex justify-between items-center mt-8">
        <div className="flex items-center gap-2">
          <span>Hiển thị:</span>
          <select
            className="select select-bordered"
            value={size}
            onChange={handleSizeChange}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>

        <div className="join">
          <button
            className="join-item btn"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0 || isLoading}
          >
            «
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`join-item btn ${page === index ? 'btn-active' : ''}`}
              onClick={() => handlePageChange(index)}
              disabled={isLoading}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="join-item btn"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1 || isLoading}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}

export default Products;