import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../store/slices/categorySlice';
import { setSelectedCategory } from '../../store/slices/productSlice';

const sortOptions = [
  { value: 'name', label: 'Tên sản phẩm' },
  { value: 'price', label: 'Giá' },
  { value: 'createdDate', label: 'Mới nhất' },
];

const sortDirOptions = [
  { value: 'asc', label: 'Tăng dần' },
  { value: 'desc', label: 'Giảm dần' },
];

function ProductFilter({ onFilterChange }) {
  const dispatch = useDispatch();
  const { items: categories } = useSelector((state) => state.categories);
  const [filters, setFilters] = useState({
    categoryId: '',
    sortBy: '',
    sortDir: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    if (name === 'categoryId') {
      dispatch(setSelectedCategory(value ? parseInt(value) : null));
    }

    onFilterChange(newFilters);
  };

  return (
    <div className="mb-6">
      {/* Categories */}
      <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
        <button
          className={`btn btn-sm ${!filters.categoryId ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleFilterChange({ target: { name: 'categoryId', value: '' } })}
        >
          Tất cả
        </button>
        {categories.map((category) => (
          <button
            key={category.categoryId}
            className={`btn btn-sm ${
              filters.categoryId === category.categoryId.toString() ? 'btn-primary' : 'btn-outline'
            }`}
            onClick={() =>
              handleFilterChange({
                target: { name: 'categoryId', value: category.categoryId.toString() },
              })
            }
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sort By */}
        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleFilterChange}
          className="select select-bordered w-full"
        >
          <option value="">Sắp xếp theo</option>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Sort Direction */}
        <select
          name="sortDir"
          value={filters.sortDir}
          onChange={handleFilterChange}
          className="select select-bordered w-full"
        >
          <option value="">Thứ tự sắp xếp</option>
          {sortDirOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Price Range */}
        <input
          type="number"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleFilterChange}
          placeholder="Giá tối thiểu"
          className="input input-bordered w-full"
        />
        <input
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          placeholder="Giá tối đa"
          className="input input-bordered w-full"
        />
      </div>
    </div>
  );
}

export default ProductFilter;