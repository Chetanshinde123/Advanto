import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ month }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(
    () => {
      if (!month) return; // Ensure month is provided

      const fetchPieData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `http://localhost:3000/api/pie?month=${month}`
          );

          console.log(response.data);

          if (response.data.status !== "Success") {
            throw new Error(response.data.message || "Failed to fetch data");
          }

          const categories = response.data.data;
          setChartData({
            labels: Object.keys(categories),
            datasets: [
              {
                data: Object.values(categories),
                backgroundColor: [
                  "#ff6384",
                  "#36a2eb",
                  "#ffce56",
                  "#4bc0c0",
                  "#9966ff",
                  "#ff9f40",
                  "#ffcd56",
                  "#4b0082",
                  "#00ff7f",
                  "#ff4500"
                ].slice(0, Object.keys(categories).length) // Ensures correct color mapping
              }
            ]
          });
        } catch (error) {
          console.error("Error fetching pie chart data:", error);
          setError("Failed to load chart data. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchPieData();
    },
    [month]
  );

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
        {loading ? "Loading..." : `Pie Chart for ${month}`}
      </h2>

      {error
        ? <p className="text-red-500 text-center">
            {error}
          </p>
        : <div className="flex justify-center">
            <Pie
              ref={chartRef}
              data={chartData}
              options={{
                responsive: true, // Enables responsiveness
                maintainAspectRatio: false, // Allows dynamic height/width
                plugins: {
                  legend: { position: "bottom" }
                }
              }}
            />
          </div>}
    </div>
  );
};

export default PieChart;
