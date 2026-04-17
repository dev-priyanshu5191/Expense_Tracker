import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import ExpenseChart from "./ExpenseChart";
import MonthlyChart from "./MonthlyChart";
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

  const now = new Date();

  // USER calculations
  const totalExpense = expenses.reduce(
    (acc, curr) => acc + Number(curr.amount || 0),
    0
  );

  const monthlyExpense = expenses
    .filter(exp => {
      const d = new Date(exp.date);
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  // ADMIN calculations
  const adminTotalExpense = allUsersExpenses.reduce(
    (acc, curr) => acc + Number(curr.amount || 0),
    0
  );

  const adminMonthlyExpense = allUsersExpenses
    .filter(exp => {
      const d = new Date(exp.date);
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  return (
    <div className="app-container animate-slide-up">
      
      {/* Navbar */}
      <div className="header-nav">
        <div>
          <h1 className="header">
            Smart<span>Finance</span>
          </h1>
          {userRole === "admin" && (
            <span className="admin-badge">Admin Mode Active</span>
          )}
        </div>

        <div className="user-profile">
          <div className="avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span>{userName}</span>

          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>

      {userRole === "user" ? (
        <>
          {/* USER KPI */}
          <div className="kpi-container">
            <div className="kpi-card">
              <h4>Total Spent</h4>
              <h2>₹{totalExpense.toLocaleString()}</h2>
            </div>

            <div className="kpi-card">
              <h4>This Month</h4>
              <h2>₹{monthlyExpense.toLocaleString()}</h2>
            </div>

            <div className="kpi-card">
              <h4>Transactions</h4>
              <h2>{expenses.length}</h2>
            </div>
          </div>

          <div className="top-section">
            <ExpenseForm 
              fetchExpenses={() => setUpdateTrigger(!updateTrigger)} 
              expenseToEdit={expenseToEdit} 
              setExpenseToEdit={setExpenseToEdit} 
            />

            <ExpenseChart 
              expenses={expenses}
              totalExpense={totalExpense} 
            />
          </div>

          <MonthlyChart expenses={expenses} />

          <ExpenseList 
            expenses={expenses} 
            fetchExpenses={() => setUpdateTrigger(!updateTrigger)} 
            setExpenseToEdit={setExpenseToEdit} 
            isAdminView={false} 
          />
        </>
      ) : (
        <>
          {/* ADMIN KPI */}
          <div className="kpi-container">
            <div className="kpi-card">
              <h4>Total Platform Spend</h4>
              <h2>₹{adminTotalExpense.toLocaleString()}</h2>
            </div>

            <div className="kpi-card">
              <h4>This Month</h4>
              <h2>₹{adminMonthlyExpense.toLocaleString()}</h2>
            </div>

            <div className="kpi-card">
              <h4>Total Transactions</h4>
              <h2>{allUsersExpenses.length}</h2>
            </div>
          </div>

          <div className="top-section">
            <ExpenseChart 
              expenses={allUsersExpenses}
              totalExpense={adminTotalExpense}
            />
          </div>

          <MonthlyChart expenses={allUsersExpenses} />

          <div className="card">
            <h3>Admin Global Dashboard</h3>

            <ExpenseList 
              expenses={allUsersExpenses} 
              isAdminView={true} 
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;