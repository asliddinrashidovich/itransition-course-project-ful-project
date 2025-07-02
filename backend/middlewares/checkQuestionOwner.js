// middlewares/checkQuestionOwner.js
const { Question, Template } = require('../models');

const checkQuestionOwner = async (req, res, next) => {
  const questionId = req.params.questionId || req.params.id;

  if (!questionId) return res.status(400).json({ message: 'Question ID is required' });

  try {
    const question = await Question.findByPk(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const template = await Template.findByPk(question.templateId);
    if (!template) return res.status(404).json({ message: 'Template not found for this question' });

    const isOwner = template.authorId === req.user.id;
    const isAdmin = req.user.isAdmin;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You are not allowed to modify questions in this template." });
    }

    req.template = template;
    req.question = question;
    next();
  } catch (err) {
    console.error('❌ checkQuestionOwner error:', err);
    return res.status(500).json({ message: 'Server error in question permission check' });
  }
};

module.exports = checkQuestionOwner;
