import { useState } from "react";
import PieChart from "./Charts/PieChart";

const PieCharts = () => {
  const [selectedMonth, setSelectedMonth] = useState("April");

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
    "December"
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-lg w-full">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Categories
        </h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Select Month:
          </label>
          <select
            onChange={e => setSelectedMonth(e.target.value)}
            value={selectedMonth}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            {months.map(month =>
              <option key={month} value={month}>
                {month}
              </option>
            )}
          </select>
        </div>

        <div className="flex justify-center">
          <PieChart month={selectedMonth} />
        </div>
      </div>
    </div>
  );
};

export default PieCharts;
