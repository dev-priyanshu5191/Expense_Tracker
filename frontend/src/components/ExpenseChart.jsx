import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ expenses = [], totalExpense = 0 }) => {

  const chartData = useMemo(() => {
    if (!expenses.length) return null;

    const categoryMap = {};

    expenses.forEach((exp) => {
      categoryMap[exp.category] =
        (categoryMap[exp.category] || 0) + exp.amount;
    });

    return {
      labels: Object.keys(categoryMap),
      datasets: [
        {
          data: Object.values(categoryMap),
          backgroundColor: [
            "#4F46E5",
            "#10B981",
            "#F59E0B",
            "#EF4444",
            "#8B5CF6",
            "#3B82F6",
          ],
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    };
  }, [expenses]);

  const options = {
    layout: {
      padding: 10,
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { family: "'Poppins', sans-serif", size: 12 },
        },
      },
    },
    cutout: "72%",
    maintainAspectRatio: false,
  };

  return (
    <div className="card chart-container">
      <h3>📊 Spending Analysis</h3>

      <div className="chart-wrapper">
        {chartData ? (
          <>
            <Doughnut data={chartData} options={options} />
            <div className="chart-center-text">
              <span>Total</span>
              <h4>₹{totalExpense.toLocaleString()}</h4>
            </div>
          </>
        ) : (
          <p style={{ color: "#6B7280", textAlign: "center", marginTop: "100px" }}>
            No data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default ExpenseChart;