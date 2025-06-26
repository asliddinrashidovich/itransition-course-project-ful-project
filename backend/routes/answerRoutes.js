// routes/answerRoutes.js
const express = require('express');
const { submitAnswers } = require('../controllers/answerController');
const router = express.Router();

router.post('/', submitAnswers); // POST /api/answers

module.exports = router;
