const express = require('express');
const {
  getAllUsers,
  getMe,
  updateUsersStatus,
  updateUsersRole,
  deleteUsers,
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/all', getAllUsers);         // Barcha foydalanuvchilarni olish
router.get('/me', protect, getMe);                // Foydalanuvchi o‘zini ko‘radi
router.patch('/status', protect, updateUsersStatus); // Block/unblock
router.patch('/role', protect, updateUsersRole);     // Admin qilish / olib tashlash
router.delete('/', protect, deleteUsers);            // Foydalanuvchini o‘chirish

module.exports = router;
