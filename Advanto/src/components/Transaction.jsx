import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "./Pagination";

const months = [
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("March");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const monthIndex = months.indexOf(month) + 1;
      const { data } = await axios.get("http://localhost:3000/api/init", {
        params: { page, limit: perPage, keyword: search, month: monthIndex },
      });
      setTransactions(data.data);
      setPagination(data.pagination);
      setLoading(false);
    };
    fetchTransactions();
  }, [month, page, search, perPage]);


  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    
    // When searching, reset month to show all transactions
    setMonth(null);
  };

  const handleMonthChange = (e) => {
    
    setMonth(e.target.value);
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-0">
      <h1 className="text-center text-3xl font-semibold mb-6">Transaction Dashboard</h1>

      <div className="flex flex-col md:flex-row justify-between mb-6 items-center">
        {/* Search Box */}
        <input
          type="text"
          placeholder="Search transaction"
          value={search}
          onChange={handleSearchChange}
          className="w-full md:w-1/3 p-3 border border-gray-950 rounded mb-4 md:mb-0"
        />

        {/* Month Dropdown */}
        <select
          value={month}
          onChange={handleMonthChange}
          className="w-full md:w-1/3 p-3 border border-gray-950 rounded"
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Transaction Table */}
      {loading ? (
  <p className="text-center text-xl">Loading...</p>
) : (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-900 border-collapse rounded-lg">
      <thead>
        <tr className="bg-gray-200 text-left">
          <th className="p-3 border border-gray-900">ID</th>
          <th className="p-3 border border-gray-900">Title</th>
          <th className="p-3 border border-gray-900">Description</th>
          <th className="p-3 border border-gray-900">Price</th>
          <th className="p-3 border border-gray-900">Category</th>
          <th className="p-3 border border-gray-900">Sold</th>
          <th className="p-3 border border-gray-900">Image</th>
        </tr>
      </thead>
      <tbody>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <tr key={transaction._id} className="hover:bg-gray-100">
              <td className="p-3 border border-gray-900">{transaction.id}</td>
              <td className="p-3 border border-gray-900">{transaction.title}</td>
              <td className="p-3 border border-gray-900">{transaction.description}</td>
              <td className="p-3 border border-gray-900">${transaction.price}</td>
              <td className="p-3 border border-gray-900">{transaction.category}</td>
              <td className="p-3 border border-gray-900">{transaction.sold ? "Yes" : "No"}</td>
              <td className="p-3 border border-gray-900">
                <img
                  src={transaction.image}
                  alt={transaction.title}
                  className="w-12 h-12 rounded"
                />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="p-3 text-center border border-gray-900">
              No transactions found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)}


      {/* Pagination */}
      <Pagination
        pagination={pagination}
        setPage={setPage}
        perPage={perPage}
        setPerPage={setPerPage}
      />
    </div>
  );
};

export default Transactions;
