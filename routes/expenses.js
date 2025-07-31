import express from 'express';
import multer from 'multer';
import {
  addExpense,
  getExpenses,
  deleteExpense,
  getExpenseById,
  updateExpense
} from '../controllers/expenseController.js';

import { verifyToken } from '../middleware/authMiddleware.js'; // ✅ Import middleware

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ✅ Secure your routes using verifyToken
router.post('/', verifyToken, upload.single('receipt'), addExpense);
router.get('/', verifyToken, getExpenses);
router.delete('/:id', verifyToken, deleteExpense);
router.put('/:id', verifyToken, upload.single('receipt'), updateExpense);
router.get('/:id', verifyToken, getExpenseById);

export default router;
