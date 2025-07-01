import Expense from '../models/Expense.js';
import fs from 'fs';
import path from 'path';

export const addExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const receipt = req.file ? req.file.filename : null;

    const newExpense = new Expense({
      amount,
      description,
      category,
      receipt,
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    // Delete file if attached
    if (expense.receipt) {
      const filePath = path.join('uploads', expense.receipt);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await expense.deleteOne();
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting expense', error: err.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    const { amount, description, category } = req.body;

    if (amount) expense.amount = amount;
    if (description) expense.description = description;
    if (category) expense.category = category;

    // Handle new file upload
    if (req.file) {
      // delete old receipt file if it exists
      if (expense.receipt) {
        const oldPath = path.join('uploads', expense.receipt);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      expense.receipt = req.file.filename;
    }

    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Error updating expense', error: err.message });
  }
};
