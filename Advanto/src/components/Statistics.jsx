import { useEffect, useState } from "react";
import axios from "axios";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("March");
  const [sale, setSale] = useState(0);
  const [saleItems, setSaleItems] = useState(0);
  const [unsold, setUnsold] = useState(0);

  // Function to fetch transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const monthIndex = months.indexOf(month) + 1;
      const { data } = await axios.get("http://localhost:3000/api/statistics", {
        params: { month: monthIndex },
      });
      setSale(data.totalSaleAmount);
      setSaleItems(data.totalSoldItems);
      setUnsold(data.totalUnsoldItems);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // UseEffect to fetch transactions when month changes
  useEffect(() => {
    fetchTransactions();
  }, [month]);

  // Handle month change
  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  return (
    <div className="mx-auto py-10 px-4 md:px-10 max-w-4xl">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Sales Statistics</h2>

        <div className="mb-8">
          <label htmlFor="month" className="block text-lg font-medium text-gray-700 mb-2">Select Month</label>
          <select
            id="month"
            value={month}
            onChange={handleMonthChange}
            className="w-full md:w-1/3 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg text-center shadow-sm">
            <h3 className="text-xl font-semibold text-blue-700">Total Sale</h3>
            <p className="text-3xl font-bold text-blue-900 mt-2">${sale}</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg text-center shadow-sm">
            <h3 className="text-xl font-semibold text-green-700">Sold Items</h3>
            <p className="text-3xl font-bold text-green-900 mt-2">{saleItems}</p>
          </div>

          <div className="p-4 bg-red-50 rounded-lg text-center shadow-sm">
            <h3 className="text-xl font-semibold text-red-700">Unsold Items</h3>
            <p className="text-3xl font-bold text-red-900 mt-2">{unsold}</p>
          </div>
        </div>

        {loading && (
          <p className="mt-6 text-center text-gray-600">Loading data...</p>
        )}
      </div>
    </div>
  );
};

export default Statistics;
