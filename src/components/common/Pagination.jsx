import React from 'react';

function Pagination({
  currentPage,
  totalPages,
  isFirst,
  isLast,
  hasNext,
  hasPrevious,
  onPageChange,
  onSizeChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="flex items-center gap-2">
        <span>Hiển thị:</span>
        <select
          className="select select-bordered select-sm"
          onChange={(e) => onSizeChange(parseInt(e.target.value))}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>

      <div className="join">
        <button
          className="join-item btn btn-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirst || !hasPrevious}
        >
          «
        </button>

        {[...Array(totalPages)].map((_, index) => {
          // Hiển thị 5 nút trang xung quanh trang hiện tại
          if (
            index === 0 ||
            index === totalPages - 1 ||
            (index >= currentPage - 2 && index <= currentPage + 2)
          ) {
            return (
              <button
                key={index}
                className={`join-item btn btn-sm ${currentPage === index ? 'btn-active' : ''}`}
                onClick={() => onPageChange(index)}
              >
                {index + 1}
              </button>
            );
          }
          // Hiển thị dấu ... nếu có khoảng cách
          if (index === currentPage - 3 || index === currentPage + 3) {
            return (
              <button key={index} className="join-item btn btn-sm" disabled>
                ...
              </button>
            );
          }
          return null;
        })}

        <button
          className="join-item btn btn-sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLast || !hasNext}
        >
          »
        </button>
      </div>
    </div>
  );
}

export default Pagination;