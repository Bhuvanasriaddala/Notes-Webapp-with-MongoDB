const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.getRegister = (req, res) => {
  res.render('register', { errors: [], oldInput: {} });
};

exports.postRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('register', { errors: errors.array(), oldInput: req.body });
  }
  const { username, email, password, comment } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(422).render('register', { errors: [{ msg: 'Email already exists' }], oldInput: req.body });
    }
    user = new User({ username, email, password, comment });
    await user.save();
    // Registration success: redirect to login
    res.redirect('/login');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getLogin = (req, res) => {
  res.render('login', { errors: [], oldInput: {} });
};

const jwt = require('jsonwebtoken');

exports.postLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('login', { errors: errors.array(), oldInput: req.body, showPopup: true });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).render('login', { errors: [{ msg: 'User not found. Please register before logging in.' }], oldInput: req.body, showPopup: true });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).render('login', { errors: [{ msg: 'Invalid credentials' }], oldInput: req.body });
    }
    // Issue JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getDashboard = async (req, res) => {
  if (!req.userId) {
    return res.redirect('/login');
  }
  try {
    const user = await User.findById(req.userId);
    res.render('dashboard', { username: user.username });
  } catch {
    res.redirect('/login');
  }
};

exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/login');
};
