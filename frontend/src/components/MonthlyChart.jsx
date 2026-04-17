import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyChart = ({ expenses = [] }) => {

  const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const chartData = useMemo(() => {
    if (!expenses.length) return null;

    const monthlyTotals = Array(12).fill(0);

    expenses.forEach((exp) => {
      const month = new Date(exp.date).getMonth();
      monthlyTotals[month] += exp.amount;
    });

    return {
      labels: monthNames,
      datasets: [
        {
          label: "Amount Spent (₹)",
          data: monthlyTotals,
          backgroundColor: "#4F46E5",
          borderRadius: 6,
          barThickness: 30,
        },
      ],
    };
  }, [expenses]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(31, 41, 55, 0.9)",
        padding: 12,
        titleFont: { size: 14, family: "'Poppins', sans-serif" },
        bodyFont: {
          size: 14,
          family: "'Poppins', sans-serif",
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#F3F4F6" },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        border: { display: false },
      },
    },
  };

  return (
    <div className="card animate-slide-up" style={{ marginBottom: "30px" }}>
      <h3>📈 Monthly Spending Trends</h3>

      <div style={{ height: "300px", width: "100%" }}>
        {chartData ? (
          <Bar data={chartData} options={options} />
        ) : (
          <p style={{ color: "#6B7280", textAlign: "center", marginTop: "100px" }}>
            No data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default MonthlyChart;