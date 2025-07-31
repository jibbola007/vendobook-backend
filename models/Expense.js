import mongoose from 'mongoose';

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
    default: 'NGN',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Ensures every expense must be tied to a user
  },
});

export default mongoose.model('Expense', ExpenseSchema);