const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

// Registration
router.get('/register', authController.getRegister);
router.post(
  '/register',
  [
    body('username')
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be 3-30 characters'),
    body('email')
      .isEmail()
      .withMessage('Enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('comment')
      .optional({ checkFalsy: true })
      .isLength({ max: 200 })
      .withMessage('Comment cannot exceed 200 characters')
  ],
  authController.postRegister
);

// Login
router.get('/login', authController.getLogin);
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  authController.postLogin
);

// Dashboard
router.get('/dashboard', authController.getDashboard);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
