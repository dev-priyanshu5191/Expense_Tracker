const express = require("express");
const app = express.Router();

const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getCategoryData,
  getMonthlyData,
} = require("../controllers/expenseController");

// CRUD
app.post("/", addExpense);
app.get("/", getExpenses);
app.put("/:id", updateExpense);
app.delete("/:id", deleteExpense);

// Charts
app.get("/category", getCategoryData);
app.get("/monthly", getMonthlyData);

module.exports = app;