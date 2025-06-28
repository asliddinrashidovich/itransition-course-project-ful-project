const express = require('express');
const { getAllUsers, getMe } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/all', protect, getAllUsers); // Admin ko‘radi
router.get('/me', protect, getMe); // Har bir foydalanuvchi o‘zini ko‘radi

module.exports = router;
