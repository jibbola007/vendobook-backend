import Expense from '../models/Expense.js';
import fs from 'fs';
import path from 'path';

export const addExpense = async (req, res) => {
  try {
    const { amount, description, category, currency } = req.body;
    const receipt = req.file ? req.file.filename : null;

    const newExpense = new Expense({
      amount,
      description,
      category,
      currency,
      receipt,
      user: req.user.id, // ✅ Attach the logged-in user’s ID
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
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

export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    expense.amount = req.body.amount;
    expense.description = req.body.description;
    expense.category = req.body.category;
    expense.currency = req.body.currency; // ✅ This is the new part

    if (req.file) {
      expense.receipt = req.file.filename;
    }

    const updated = await expense.save();


    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};

