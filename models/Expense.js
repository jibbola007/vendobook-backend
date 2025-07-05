import mongoose from 'mongoose';
import { updateExpense } from '../controllers/expenseController.js';


const ExpenseSchema = new mongoose.Schema({
  amount: Number,
  description: String,
  category: String,
  receipt: String, // File path
  createdAt: {
    type: Date,
    default: Date.now,
  },

  currency: {
    type: String,
    default: 'NGN' // or '₦'
  }
});



export default mongoose.model('Expense', ExpenseSchema);