import { useState } from "react";
import BarChart from "./Charts/BarChart";

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

const Barcharts = () => {
  const [selectedMonth, setSelectedMonth] = useState("March"); // Default month

  const handleMonthChange = e => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="container mx-auto p-5 w-full">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Bar  Dashboard
      </h1>
      <div className="flex justify-center mb-4">
        <div className="mr-4">
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="p-2 border rounded"
          >
            {months.map(m =>
              <option key={m} value={m}>
                {m}
              </option>
            )}
          </select>
        </div>
      </div>

      <BarChart selectedMonth={selectedMonth} />
    </div>
  );
};

export default Barcharts;
