import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import API from "../api/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyChart = ({ updateTrigger }) => {
  const [chartData, setChartData] = useState(null);

  // Month names array (Kyunki backend 1, 2, 3 bhejta hai)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const { data } = await API.get("/expenses/monthly");
        
        if (data.length === 0) {
          setChartData(null);
          return;
        }

        const formattedData = {
          // data._id backend se 1 (Jan), 2 (Feb) aata hai, isliye -1 karke array se naam uthaya hai
          labels: data.map((item) => monthNames[item._id - 1]),
          datasets: [
            {
              label: "Amount Spent (₹)",
              data: data.map((item) => item.total),
              backgroundColor: "#4F46E5", // Premium Indigo color
              borderRadius: 6, // Bar ke corners round karega
              barThickness: 30, // Bar ki motai
            },
          ],
        };
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching monthly data", error);
      }
    };
    fetchMonthlyData();
  }, [updateTrigger]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Legend hide kiya premium look ke liye
      tooltip: {
        backgroundColor: "rgba(31, 41, 55, 0.9)",
        padding: 12,
        titleFont: { size: 14, family: "'Poppins', sans-serif" },
        bodyFont: { size: 14, family: "'Poppins', sans-serif", weight: 'bold' }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#F3F4F6" }, // Light grid lines
        border: { display: false }
      },
      x: {
        grid: { display: false }, // X axis ki lines chhupai
        border: { display: false }
      }
    }
  };

  return (
    <div className="card animate-slide-up" style={{ marginBottom: "30px" }}>
      <h3>📈 Monthly Spending Trends</h3>
      <div style={{ height: "300px", width: "100%" }}>
        {chartData ? (
          <Bar data={chartData} options={options} />
        ) : (
          <p style={{ color: "#6B7280", textAlign: "center", marginTop: "100px" }}>
            Add expenses in different months to see trends.
          </p>
        )}
      </div>
    </div>
  );
};

export default MonthlyChart;