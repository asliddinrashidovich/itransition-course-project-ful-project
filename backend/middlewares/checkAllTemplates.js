const { Template } = require('../models');

const checkTemplateViewPermission = async (req, res, next) => {
  const templateId = req.params.id;

  if (!templateId) {
    return res.status(400).json({ message: 'Template ID is required' });
  }

  try {
    const template = await Template.findByPk(templateId);

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    if (template.access == 'public') {
      req.template = template;
      return next();
    }

    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ message: 'Login required to access this template' });
    }

    const isOwner = template.authorId == currentUser.id;
    const isAdmin = currentUser.isAdmin == true;

    if (isOwner || isAdmin) {
      req.template = template;
      return next();
    }

    return res.status(403).json({ message: 'You are not allowed to view this template' });
  } catch (err) {
    console.error('checkTemplateViewPermission error:', err);
    return res.status(500).json({ message: 'Server error while checking permission' });
  }
}

module.exports = checkTemplateViewPermission;
