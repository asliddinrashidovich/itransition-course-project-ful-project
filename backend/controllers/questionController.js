const { Template, Question } = require("../models");


const { v4: uuidv4 } = require('uuid');

exports.addQuestionToTemplate = async (req, res) => {
  try {
    const { id } = req.params; // Template ID
    const {
      title = 'Untitled question',
      description = '',
      type = 'short_text',
      showInResults = false,
      options = [],
    } = req.body;

    const template = await Template.findByPk(id);
    if (!template) return res.status(404).json({ message: 'Template not found' });

    let finalOptions = [];

    if (type === 'checkbox') {
      finalOptions = options.length > 0
        ? options.map(text => ({ id: uuidv4(), text }))
        : [{ id: uuidv4(), text: 'Option 1' }];
    }

    const question = await Question.create({
      title,
      description,
      type,
      showInResults,
      templateId: id,
      options: finalOptions,
    });

    res.status(201).json(question);
  } catch (err) {
    console.error('addQuestionToTemplate error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { title, description, type, showInResults, options } = req.body;

    const question = await Question.findByPk(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    if (title !== undefined) question.title = title;
    if (description !== undefined) question.description = description;
    if (type !== undefined) question.type = type;
    if (showInResults !== undefined) question.showInResults = showInResults;

    if (type === 'checkbox') {
      // checkbox bo‘lsa, kamida bitta option bo‘lishi shart
      question.options = Array.isArray(options) && options.length > 0 ? options : ['Option 1'];
    } else {
      // boshqa turlarda options bo‘sh bo‘lishi kerak
      question.options = [];
    }

    await question.save();

    res.json({ message: 'Question updated', question });
  } catch (err) {
    console.error('updateQuestion error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addOptionToQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { newText } = req.body;

    const question = await Question.findByPk(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    if (question.type !== 'checkbox') {
      return res.status(400).json({ message: 'Only checkbox-type supports options' });
    }

    const currentOptions = question.options || [];
    const newOption = { id: uuidv4(), text: newText || `Option ${currentOptions.length + 1}` };

    question.options = [...currentOptions, newOption];
    await question.save();

    res.json({ message: 'Option added', option: newOption });
  } catch (err) {
    console.error('addOptionToQuestion error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateOptionTitle = async (req, res) => {
  try {
    const { id } = req.params; // questionId
    const { optionId, newText } = req.body;

    if (!optionId || !newText) {
      return res.status(400).json({ message: 'optionId and newText are required' });
    }

    const question = await Question.findByPk(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    if (question.type !== 'checkbox') {
      return res.status(400).json({ message: 'Only checkbox-type supports options' });
    }

    const updatedOptions = question.options.map(opt =>
      opt.id === optionId ? { ...opt, text: newText } : opt
    );

    question.options = updatedOptions;
    await question.save();

    res.json({ message: 'Option title updated', options: updatedOptions });
  } catch (err) {
    console.error('updateOptionTitle error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



// PATCH /api/templates/questions/:id/options/delete
exports.deleteOptionFromQuestion = async (req, res) => {
  try {
    const { id } = req.params; // questionId
    const { optionId } = req.body;

    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.type !== 'checkbox') {
      return res.status(400).json({ message: 'Only checkbox-type supports options' });
    }

    const updatedOptions = question.options.filter(opt => opt.id !== optionId);

    if (updatedOptions.length === 0) {
      return res.status(400).json({ message: 'At least one option is required' });
    }

    question.options = updatedOptions;
    await question.save();

    res.json({ message: 'Option deleted', options: updatedOptions });
  } catch (err) {
    console.error('deleteOptionFromQuestion error:', err);
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

exports.deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findByPk(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    await question.destroy();

    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    console.error('❌ deleteQuestion error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
