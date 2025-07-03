const express = require('express')
const { register, login, googleLogin, signupWithGoogle } = require('../controllers/authController')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/google', googleLogin); 
router.post('/signup/google', signupWithGoogle);

module.exports = router
