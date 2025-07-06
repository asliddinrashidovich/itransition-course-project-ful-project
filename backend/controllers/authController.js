const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config()
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const admin = require('../firebaseAdmin');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ where: { email }});
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const isAdmin = email == ADMIN_EMAIL;
    const user = await User.create({name, email, password: hashed, isAdmin});
    const token = generateToken(user);

    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error in server' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ where: {email}})
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (user.isBlocked) return res.status(403).json({ message: 'User is blocked' })
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' })
    const token = generateToken(user)

    res.json({ user, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error in server' })
  }
}

exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const {uid, email, name, picture} = decoded;
    let user = await User.findOne({ where: {email}});

    if (!user) {
      const isAdmin = email === ADMIN_EMAIL;
      user = await User.create({name, email, password: null, isAdmin, avatar: picture, firebaseUid: uid});
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'User is blocked' });
    }
    const token = generateToken(user);

    res.json({ user, token });
  } catch (err) {
    console.error("Firebase ID token checking error:", err);
    res.status(401).json({ message: 'Invalid Firebase token' });
  }
};

exports.signupWithGoogle = async (req, res) => {
  const { idToken } = req.body;

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decoded;
    let existing = await User.findOne({ where: { email }});

    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const isAdmin = email === ADMIN_EMAIL;
    const user = await User.create({name, email, password: null, isAdmin, avatar: picture, firebaseUid: uid});
    const token = generateToken(user);
    
    res.status(201).json({ user, token });
  } catch (err) {
    console.error('Google signup error:', err);
    res.status(401).json({ message: 'Invalid Firebase token' });
  }
};
