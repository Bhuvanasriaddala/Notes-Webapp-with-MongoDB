require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// JWT authentication middleware
app.use((req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      res.locals.userId = decoded.id;
    } catch (err) {
      req.userId = null;
      res.locals.userId = null;
    }
  } else {
    req.userId = null;
    res.locals.userId = null;
  }
  next();
});

// Routes
app.use(authRoutes);

// Home redirect
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully!');
    app.listen(5000, () => console.log('Server running on http://localhost:5000'));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
