import { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto"; // Automatically registers all required components

// BarChart component to display data for a given month
const BarChart = ({ selectedMonth }) => {
  // Define state for chart data, loading status, and error handling
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Effect to fetch chart data when the selectedMonth changes
  useEffect(
    () => {
      const fetchChartData = async () => {
        try {
          setLoading(true); // Start loading
          setError(""); // Reset error

          // Fetch data from API endpoint
          const response = await axios.get(
            `http://localhost:3000/api/barChart?month=${selectedMonth}`
          );
          console.log(response.data);

          setChartData(response.data.data); // Set the chart data
          setLoading(false); // Stop loading once data is fetched
        } catch (err) {
          setError("Error fetching bar chart data. Please try again later."); // Set error message
          setLoading(false); // Stop loading in case of error
        }
      };

      fetchChartData(); // Call the function when component mounts or selectedMonth changes
    },
    [selectedMonth]
  );

  // Labels for price ranges
  const labels = [
    "0-100",
    "101-200",
    "201-300",
    "301-400",
    "401-500",
    "501-600",
    "601-700",
    "701-800",
    "801-900",
    "901-above"
  ];

  // Data for the Bar chart
  const barChartData = {
    labels, // Using defined labels array
    datasets: [
      {
        label: "Number of Items",
        data: chartData
          ? [
              chartData["0-100"],
              chartData["101-200"],
              chartData["201-300"],
              chartData["301-400"],
              chartData["401-500"],
              chartData["501-600"],
              chartData["601-700"],
              chartData["701-800"],
              chartData["801-900"],
              chartData["901-above"]
            ]
          : [], // Fallback to an empty array if no data
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Bar background color
        borderColor: "rgba(75, 192, 192, 1)", // Bar border color
        borderWidth: 2 // Border width
      }
    ]
  };

  // Configuration options for the chart
  const chartOptions = {
    responsive: true, // Make the chart responsive to screen size
    maintainAspectRatio: false, // Adjust aspect ratio for mobile
    plugins: {
      legend: {
        position: "bottom", // Move legend to bottom for better mobile view
        labels: {
          font: {
            size: window.innerWidth < 768 ? 10 : 14 // Reduce legend font size for mobile
          }
        }
      },
      title: {
        display: true,
        text: `Price Ranges for ${selectedMonth}`, // Dynamic chart title based on the selected month
        font: {
          size: window.innerWidth < 768 ? 14 : 18 // Smaller title font for mobile
        }
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `Price Range: ${tooltipItem.label}, Items: ${tooltipItem.raw}`; // Show detailed label for tooltips
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true, // Start y-axis at 0
        max: 5, // Fixed maximum value for y-axis
        ticks: {
          stepSize: 0.5, // Set step size for y-axis
          font: {
            size: window.innerWidth < 768 ? 10 : 12 // Adjust tick font size for mobile
          }
        },
        title: {
          display: true,
          text: "Number of Items", // Y-axis label
          font: {
            size: window.innerWidth < 768 ? 12 : 14 // Adjust title font size for mobile
          }
        }
      },
      x: {
        title: {
          display: true,
          text: "Price Ranges (in USD)", // X-axis label
          font: {
            size: window.innerWidth < 768 ? 12 : 14 // Adjust title font size for mobile
          }
        },
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 10 : 12 // Adjust tick font size for mobile
          }
        }
      }
    }
  };

  // Render logic with loading, error, or chart data states
  return (
    <div className="w-full lg:w-3/4 mx-auto my-4 p-4 bg-white shadow-lg rounded-lg">
      {loading
        ? <p>Loading bar chart...</p> // Display loading state
        : error
          ? <p className="text-red-600">
              {error}
            </p> // Display error state
          : <div
              className="relative"
              style={{ height: window.innerWidth < 768 ? "300px" : "400px" }}
            >
              <Bar data={barChartData} options={chartOptions} />{" "}
              {/* Render chart */}
            </div>}
    </div>
  );
};

export default BarChart;
