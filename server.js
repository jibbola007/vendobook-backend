import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import expenseRoutes from './routes/expenses.js';
import fs from 'fs';
import authRoutes from './routes/authRoutes.js';


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', authRoutes);



const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)

  .then(() => {
    const uploadPath = 'uploads';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));