// controllers/answerController.js
const Answer = require('../models/answer.model');

exports.submitAnswers = async (req, res) => {
  try {
    const { templateId, answers, responderEmail } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid answers array' });
    }

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
