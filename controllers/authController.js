import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const createToken = (user) => {
  return jwt.sign({ id: user._id }, 'yourSecretKey', { expiresIn: '1d' });
};

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const user = new User({ email, password });
    await user.save();

    const token = createToken(user);
    res.status(201).json({ user: { id: user._id, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = createToken(user);
    res.status(200).json({ user: { id: user._id, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};