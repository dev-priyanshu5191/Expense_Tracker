const Expense = require("../models/Expense");
const mongoose = require("mongoose");

//  Add Expense
exports.addExpense = async (req, res) => {
  try {
    const expense = await Expense.create({ ...req.body, user: req.user.id });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get User's Expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Update Expense
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await expense.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get Category Data (Pie Chart)
exports.getCategoryData = async (req, res) => {
  try {
    const data = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } }
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get Monthly Data (Bar Chart)
exports.getMonthlyData = async (req, res) => {
  try {
    const data = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: { $month: "$date" }, 
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id": 1 } }
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsersExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate("user", "name email").sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};