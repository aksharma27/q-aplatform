const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function validateEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashed });
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ email });
    if (!user || user.banned) return res.status(401).json({ msg: 'Invalid credentials or user banned' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
