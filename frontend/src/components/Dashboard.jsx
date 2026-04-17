import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import ExpenseChart from "./ExpenseChart";
import MonthlyChart from "./MonthlyChart"; // Naya Monthly Chart yahan import hua
import API from "../api/api";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [allUsersExpenses, setAllUsersExpenses] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null); 
  
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    fetchExpenses();
    if (userRole === "admin") fetchAllUsersExpenses();
  }, [updateTrigger]);

  const fetchExpenses = async () => {
    try {
      const { data } = await API.get("/expenses");
      setExpenses(data);
    } catch (err) {
      if(err.response?.status === 401) handleLogout();
    }
  };

  const fetchAllUsersExpenses = async () => {
    try {
      const { data } = await API.get("/expenses/admin/all");
      setAllUsersExpenses(data);
    } catch (err) {
      console.log("Admin fetch error", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // KPI Calculations
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const monthlyExpense = expenses
    .filter(exp => new Date(exp.date).getMonth() === new Date().getMonth())
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="app-container animate-slide-up">
      
      {/* 🚀 Top Navigation Bar */}
      <div className="header-nav">
        <div>
          <h1 className="header" style={{ marginBottom: 0 }}>Smart<span>Finance</span></h1>
          {userRole === "admin" && <span className="admin-badge">Admin Mode Active</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="user-profile">
            <div className="avatar">{userName.charAt(0).toUpperCase()}</div>
            <span>{userName}</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </div>

      {userRole === "user" ? (
        <>
          {/* 📊 KPI Summary Cards */}
          <div className="kpi-container">
            <div className="kpi-card" style={{ borderColor: '#4F46E5' }}>
              <h4>Total Spent</h4>
              <h2>₹{totalExpense.toLocaleString()}</h2>
            </div>
            <div className="kpi-card" style={{ borderColor: '#10B981' }}>
              <h4>This Month</h4>
              <h2>₹{monthlyExpense.toLocaleString()}</h2>
            </div>
            <div className="kpi-card" style={{ borderColor: '#F59E0B' }}>
              <h4>Transactions</h4>
              <h2>{expenses.length}</h2>
            </div>
          </div>

          {/* 📝 Form aur Pie Chart ka section */}
          <div className="top-section">
            <ExpenseForm 
              fetchExpenses={() => setUpdateTrigger(!updateTrigger)} 
              expenseToEdit={expenseToEdit} 
              setExpenseToEdit={setExpenseToEdit} 
            />
            <ExpenseChart updateTrigger={updateTrigger} totalExpense={totalExpense} />
          </div>

          {/* 📈 Naya Monthly Trend Bar Chart */}
          <MonthlyChart updateTrigger={updateTrigger} />

          {/* 📜 Expense List (Table) */}
          <ExpenseList 
            expenses={expenses} 
            fetchExpenses={() => setUpdateTrigger(!updateTrigger)} 
            setExpenseToEdit={setExpenseToEdit} 
            isAdminView={false} 
          />
        </>
      ) : (
        /* 👑 Admin ka Global Panel */
        <div className="admin-panel animate-slide-up">
          <div className="card">
            <h3 style={{ color: "var(--primary-color)" }}>👑 Admin Global Dashboard</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
              Viewing all transactions across the entire platform.
            </p>
            <ExpenseList expenses={allUsersExpenses} isAdminView={true} />
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;