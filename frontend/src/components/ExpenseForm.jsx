import React, { useState, useEffect } from "react";
import API from "../api/api";

const ExpenseForm = ({ fetchExpenses, expenseToEdit, setExpenseToEdit }) => {
  const [formData, setFormData] = useState({ amount: "", category: "Food", description: "", date: new Date().toISOString().split("T")[0] });

  // Agar edit button click hua hai, toh form me data bhar do
  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        amount: expenseToEdit.amount, category: expenseToEdit.category,
        description: expenseToEdit.description, date: expenseToEdit.date.split("T")[0]
      });
    }
  }, [expenseToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (expenseToEdit) {
        await API.put(`/expenses/${expenseToEdit._id}`, formData);
        setExpenseToEdit(null); // Edit done, clear it
      } else {
        await API.post("/expenses", formData);
      }
      setFormData({ amount: "", category: "Food", description: "", date: new Date().toISOString().split("T")[0] });
      fetchExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card">
      <h3>{expenseToEdit ? "✏️ Edit Transaction" : "✨ Add New Transaction"}</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Amount (₹)</label>
          <input type="number" name="amount" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
        </div>
        <div className="input-group">
          <label>Category</label>
          <select name="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="input-group">
          <label>Description</label>
          <input type="text" name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
        </div>
        <div className="input-group">
          <label>Date</label>
          <input type="date" name="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
        </div>
        <div style={{display: 'flex', gap: '10px'}}>
          <button type="submit" className="btn-primary" style={{flex: 1}}>
            {expenseToEdit ? "Update Expense" : "Add Expense"}
          </button>
          {expenseToEdit && (
            <button type="button" className="btn-logout" onClick={() => { setExpenseToEdit(null); setFormData({ amount: "", category: "Food", description: "", date: new Date().toISOString().split("T")[0] })}}>Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;