import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setPage, setSize } from '../store/slices/productSlice';
import ProductList from '../components/product/ProductList';
import ProductFilter from '../components/product/ProductFilter';
import Pagination from '../components/common/Pagination';

function Products() {
  const dispatch = useDispatch();
  const {
    items,
    page,
    size,
    totalPages,
    isFirst,
    isLast,
    hasNext,
    hasPrevious,
    selectedCategory,
    isLoading,
    error
  } = useSelector((state) => state.products);

  const handleFilterChange = (filters) => {
    dispatch(setPage(0)); // Reset về trang đầu tiên khi thay đổi bộ lọc
    dispatch(
      fetchProducts({
        page: 0,
        size,
        categoryId: filters.categoryId ? parseInt(filters.categoryId) : null,
        sortBy: filters.sortBy || null,
        sortDir: filters.sortDir || null,
        minPrice: filters.minPrice || null,
        maxPrice: filters.maxPrice || null,
      })
    );
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  const handleSizeChange = (newSize) => {
    dispatch(setSize(newSize));
    dispatch(setPage(0));
  };

  useEffect(() => {
    dispatch(
      fetchProducts({
        page,
        size,
        categoryId: selectedCategory,
      })
    );
  }, [dispatch, page, size, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sản phẩm</h1>

      {/* Filters */}
      <ProductFilter onFilterChange={handleFilterChange} />

      {/* Product List */}
      <ProductList />

      {/* Pagination */}
      {!isLoading && items.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            isFirst={isFirst}
            isLast={isLast}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            onPageChange={handlePageChange}
            onSizeChange={handleSizeChange}
          />
        </div>
      )}
    </div>
  );
}

export default Products;