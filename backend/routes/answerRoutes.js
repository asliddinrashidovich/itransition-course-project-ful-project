// routes/answerRoutes.js
const express = require('express');
const { submitAnswers, getAnswersByTemplateId } = require('../controllers/answerController');
const router = express.Router();

router.post('/', submitAnswers);  
router.get("/template/:templateId", getAnswersByTemplateId);

module.exports = router;
