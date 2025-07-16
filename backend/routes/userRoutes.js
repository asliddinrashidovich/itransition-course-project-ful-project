const express = require('express');
const {
  getAllUsers,
  getMe,
  updateUsersStatus,
  updateUsersRole,
  deleteUsers,
  getOrCreateApiToken,
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { verifyToken } = require('../middlewares/verify-token');

const router = express.Router();

router.get('/all', getAllUsers);       
router.get('/me', protect, getMe);             
router.patch('/status', protect, updateUsersStatus) 
router.patch('/role', protect, updateUsersRole);     
router.delete('/', protect, deleteUsers);
router.get('/me/token', verifyToken, getOrCreateApiToken);

module.exports = router;
