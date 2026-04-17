import React from "react";
import API from "../api/api";

const ExpenseList = ({ expenses, fetchExpenses, setExpenseToEdit, isAdminView }) => {
  const handleDelete = async (id) => {
    if(window.confirm("Delete this expense?")) {
      await API.delete(`/expenses/${id}`);
      fetchExpenses();
    }
  };

  return (
    <div className="card animate-slide-up" style={{ marginTop: isAdminView ? '0' : '20px' }}>
      <h3>{isAdminView ? "All Users Database" : "My Transactions"}</h3>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              {isAdminView && <th>User</th>}
              <th>Category</th>
              <th>Details</th>
              <th>Amount</th>
              {!isAdminView && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp._id}>
                <td style={{ color: "#6B7280" }}>{new Date(exp.date).toLocaleDateString()}</td>
                {isAdminView && <td style={{fontWeight: "bold", color: "var(--primary-color)"}}>{exp.user?.name || "Unknown"}</td>}
                <td><span className="category-badge">{exp.category}</span></td>
                <td>{exp.description || "-"}</td>
                <td style={{ fontWeight: 700 }}>₹{exp.amount}</td>
                {!isAdminView && (
                  <td>
                    <button className="edit-btn" onClick={() => setExpenseToEdit(exp)}>✏️ Edit</button>
                    <button className="delete-btn" style={{marginLeft: "10px"}} onClick={() => handleDelete(exp._id)}>🗑️</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;