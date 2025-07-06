const { Answer, Template, User } = require("../models");

exports.submitAnswers = async (req, res) => {
  try {
    const {templateId, answers, responderEmail} = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({message: 'Wrong answers array'});
    }

    const template = await Template.findByPk(templateId);
    if (!template) {
      return res.status(404).json({message: "Template not found"});
    }

    const user = responderEmail ? await User.findOne({ where: { email: responderEmail }}) : null;
    const isOwner = user && user.id == template.authorId;
    const isAllowed = template.allowedUsers.includes(responderEmail);
    const isAdmin = user && user.role == 'admin';

    if (template.access == 'restricted' && !(isOwner || isAllowed || isAdmin)) {
      return res.status(403).json({ message: "Access denied: You are not allowed to fill out this form" });
    }

    if (isOwner) {
      return res.status(403).json({ message: "Form creators cannot fill their own forms" });
    }

    const existing = await Answer.findOne({where: { templateId, responderEmail}});

    if (existing) {
      return res.status(400).json({ message: "You have already submitted this form" });
    }

    const createdAnswers = await Promise.all(
      answers.map((answer) =>
        Answer.create({templateId, questionId: answer.questionId, value: Array.isArray(answer.value) ? JSON.stringify(answer.value) : answer.value, responderEmail: responderEmail || null})
      )
    );

    res.status(201).json({ message: 'Answers submitted successfully', createdAnswers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error in server' });
  }
};

exports.getAnswersByTemplateId = async (req, res) => {
  try {
    const { templateId } = req.params;

    const allAnswers = await Answer.findAll({ where: { templateId }, order: [['createdAt', 'ASC']]});
    const grouped = {};

    for (const ans of allAnswers) {
      const email = ans.responderEmail || 'anonymous';

      if (!grouped[email]) {
        grouped[email] = [];
      }
      grouped[email].push({
        questionId: ans.questionId,
        value: tryParseJson(ans.value)
      });
    }

    const result = Object.entries(grouped).map(([email, answers]) => ({responderEmail: email, answers}));

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error in server' });
  }
};

function tryParseJson(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}


