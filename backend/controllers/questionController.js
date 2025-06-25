const Question = require("../models/question.model");
const Template = require("../models/template.model");
// const { Template, Question } = require('../models/template.model');


// Savol qo‘shish
exports.addQuestionToTemplate = async (req, res) => {
  try {
    const { id } = req.params; // template ID
    const { title = 'Untitled question', description = '', type = 'short_text', showInResults = false } = req.body;

    const template = await Template.findByPk(id);
    if (!template) return res.status(404).json({ message: 'Template not found' });

    const question = await Question.create({
      title,
      description,
      type,
      showInResults,
      templateId: id
    });

    res.status(201).json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { title, description, type, showInResults } = req.body;

    const question = await Question.findByPk(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    // Faqat mavjud (undefined bo'lmagan) qiymatlarni yangilaymiz
    if (title !== undefined) question.title = title;
    if (description !== undefined) question.description = description;
    if (type !== undefined) question.type = type;
    if (showInResults !== undefined) question.showInResults = showInResults;

    await question.save();

    res.json({ message: 'Question updated', question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateQuestionType = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { type } = req.body;

    const allowedTypes = ['short_text', 'paragraph', 'number', 'checkbox'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid type' });
    }

    const question = await Question.findByPk(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    question.type = type;
    await question.save();

    res.json({ message: 'Question type updated', question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateQuestionTitle = async (req, res) => {
  try {
    const questionId = req.params.id;
    const { title } = req.body;

    const question = await Question.findByPk(questionId);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.title = title;
    await question.save();

    res.json({ message: 'Question title updated', question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
