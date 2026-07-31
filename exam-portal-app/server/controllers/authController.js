const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, rollNumber, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const safeRole = role === 'faculty' ? 'faculty' : 'student';
    const user = await User.create({ name, email, password, role: safeRole, rollNumber, phone });

    res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) { next(err); }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};
