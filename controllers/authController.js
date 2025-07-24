import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const createToken = (user) => {
  return jwt.sign({ id: user._id }, 'yourSecretKey', { expiresIn: '1d' });
};

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("➡️ Signup request:", email);

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("❌ Email already exists");
      return res.status(400).json({ message: 'Email already in use' });
    }

    // ✅ Assign raw password, let Mongoose hash it using pre-save
    const user = new User({ email, password });
    await user.save();
    console.log("✅ User saved to DB:", user);

    const token = createToken(user);
    res.status(201).json({ user: { id: user._id, email: user.email }, token });
  } catch (err) {
    console.error("🔥 Signup Error:", err);
    res.status(500).json({ error: 'Signup failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email, password);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log("✅ User found:", user.email);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("❌ Password does not match");
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user);
    return res.status(200).json({ user: { id: user._id, email: user.email }, token });

  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    
    user.password = password;
    await user.save();

   res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
