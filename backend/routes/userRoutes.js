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

router.get('/all', getAllUsers);       
router.get('/me', protect, getMe);             
router.patch('/status', protect, updateUsersStatus) 
router.patch('/role', protect, updateUsersRole);     
router.delete('/', protect, deleteUsers);

module.exports = router;
