// middlewares/checkTemplateOwner.js
const { Template } = require('../models');

const checkTemplateOwner = async (req, res, next) => {
  const templateId = req.params.id || req.params.templateId || req.body.templateId;

  if (!templateId) return res.status(400).json({ message: 'Template ID is required' });

  try {
    const template = await Template.findByPk(templateId);
    if (!template) return res.status(404).json({ message: 'Template not found' });

    const isOwner = template.authorId === req.user.id;
    const isAdmin = req.user.isAdmin;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You cannot modify other people's templates." });
    }

    req.template = template; 
    next();
  } catch (err) {
    console.error('❌ checkTemplateOwner error:', err);
    return res.status(500).json({ message: 'Server error in permission check' });
  }
};

module.exports = checkTemplateOwner;
