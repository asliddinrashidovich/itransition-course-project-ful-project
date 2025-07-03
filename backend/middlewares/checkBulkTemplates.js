const { Template } = require('../models');

const checkBulkTemplateOwner = async (req, res, next) => {
  const templateIds = req.body.templateIds;

  if (!Array.isArray(templateIds) || templateIds.length === 0) {
    return res.status(400).json({ message: 'templateIds must be a non-empty array' });
  }

  try {
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin || req.user.role === 'admin';

    // Barcha templatelarni olish
    const templates = await Template.findAll({
      where: { id: templateIds },
    });

    // Foydalanuvchining ruxsati borlar ro‘yxatini tekshiramiz
    const unauthorizedTemplates = templates.filter(
      (template) => template.authorId !== userId && !isAdmin
    );

    if (unauthorizedTemplates.length > 0) {
      return res.status(403).json({
        message: 'You are not allowed to delete some of these templates.',
        unauthorizedIds: unauthorizedTemplates.map(t => t.id),
      });
    }

    next();
  } catch (err) {
    console.error('❌ checkBulkTemplateOwner error:', err);
    return res.status(500).json({ message: 'Server error in bulk permission check' });
  }
};

module.exports = checkBulkTemplateOwner;
