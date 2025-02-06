import React from 'react';

const Pagination = ({ pagination, setPage, perPage, setPerPage }) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <p className="text-sm">Page No: {pagination.currentPage || 1}</p>

      <div className="flex items-center">
        <button
          onClick={() => setPage(pagination.prev ? pagination.prev.page : 1)}
          className={`py-2 px-4 mr-2 ${!pagination.prev ? "bg-gray-300" : "bg-yellow-400"} text-white font-semibold rounded`}
          disabled={!pagination.prev}
        >
          Previous
        </button>

        <button
          onClick={() => setPage(pagination.next ? pagination.next.page : 1)}
          className={`py-2 px-4 ${!pagination.next ? "bg-gray-300" : "bg-yellow-400"} text-white font-semibold rounded`}
          disabled={!pagination.next}
        >
          Next
        </button>
      </div>

      <div>
        <select
          value={perPage}
          onChange={(e) => setPerPage(parseInt(e.target.value))}
          className="p-2 border border-gray-300 rounded"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;
