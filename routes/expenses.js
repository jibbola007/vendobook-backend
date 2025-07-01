import express from 'express';
import multer from 'multer';
import { addExpense, getExpenses, deleteExpense,  updateExpense } from '../controllers/expenseController.js';

const router = express.Router();

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

router.post('/', upload.single('receipt'), addExpense);
router.get('/', getExpenses);
router.delete('/:id', deleteExpense);
router.put('/:id', upload.single('receipt'), updateExpense);


export default router;

