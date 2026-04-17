import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import API from "../api/api";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ updateTrigger, totalExpense }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const { data } = await API.get("/expenses/category");
        
        if (data.length === 0) {
          setChartData(null);
          return;
        }

        const formattedData = {
          labels: data.map((item) => item._id),
          datasets: [{
            data: data.map((item) => item.total),
            backgroundColor: ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#3B82F6"],
            borderWidth: 0,
            hoverOffset: 6, // Hover animation thodi smooth ki hai
          }],
        };
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching chart", error);
      }
    };
    fetchCategoryData();
  }, [updateTrigger]);

  const options = {
    layout: {
      padding: 10 // Chart ko borders se dur rakhega (Overlap fix)
    },
    plugins: {
      legend: { 
        position: 'bottom', 
        labels: { 
          usePointStyle: true, 
          padding: 20,
          font: { family: "'Poppins', sans-serif", size: 12 }
        } 
      }
    },
    cutout: '72%', // Center circle ka size fix kiya
    maintainAspectRatio: false // Wrapper ki height ko follow karega
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
              <h4>₹{totalExpense ? totalExpense.toLocaleString() : 0}</h4>
            </div>
          </>
        ) : (
          <p style={{ color: "#6B7280", textAlign: "center", marginTop: "100px" }}>Add expenses to see chart.</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseChart;