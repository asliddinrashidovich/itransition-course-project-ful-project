// controllers/answerController.js
// const Answer = require('../models/answer.model');
const { Answer } = require("../models");

exports.submitAnswers = async (req, res) => {
  try {
    const { templateId, answers, responderEmail } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid answers array' });
    }

    // ✅ 1. Tekshir: bu user shu formani to'ldirganmi?
    const existing = await Answer.findOne({
      where: {
        templateId,
        responderEmail,
      },
    });

    if (existing) {
      return res.status(400).json({ message: "You have already submit this form, try with another email" });
    }

    // ✅ 2. Javoblarni saqlash
    const createdAnswers = await Promise.all(
      answers.map((answer) =>
        Answer.create({
          templateId,
          questionId: answer.questionId,
          value: answer.value,
          responderEmail: responderEmail || null,
        })
      )
    );

    res.status(201).json({ message: 'Answers submitted successfully', createdAnswers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getAnswersByTemplateId = async (req, res) => {
  try {
    const { templateId } = req.params;

    const allAnswers = await Answer.findAll({
      where: { templateId },
      order: [['createdAt', 'ASC']],
    });

    // Group answers by responderEmail
    const grouped = {};

    for (const ans of allAnswers) {
      const email = ans.responderEmail || 'anonymous';

      if (!grouped[email]) {
        grouped[email] = [];
      }

      grouped[email].push({
        questionId: ans.questionId,
        value: ans.value
      });
    }

    // Convert grouped object to array
    const result = Object.entries(grouped).map(([email, answers]) => ({
      responderEmail: email,
      answers
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

