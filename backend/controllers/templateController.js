const { User, Question, Template, Answer } = require('../models')

// Create template with default question
exports.createTemplate = async (req, res) => {
  try {
    const userId = req.user.id
    const {
      title = "Untitled form",
      formTitle = "Untitled form",
      description = "Form description",
      topic = "",
      tags = [],
      imageUrl = "",
      access = "public",
      allowedUsers = []
    } = req.body

    const newTemplate = await Template.create({
      title,
      formTitle,
      description,
      topic,
      tags,
      imageUrl,
      access,
      allowedUsers,
      authorId: userId,
    })

    // Default question qo‘shish
    await Question.create({
      title: "Untitled question",
      description: "",
      type: "short_text",
      showInResults: false,
      templateId: newTemplate.id
    })

    // Bog‘langan questions bilan qaytarish
    const result = await Template.findByPk(newTemplate.id, {
      include: [{ model: Question, as: 'questions' }]
    })

    res.status(201).json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}


// Get all public templates
exports.getTemplates = async (req, res) => {
  try {
    const currentUser = req.user || null;

    const templates = await Template.findAll({
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']],
    });

    const visibleTemplates = templates.filter(template => {
      if (template.access === 'public') return true;

      if (!currentUser) return false;

      const isOwner = template.authorId === currentUser.id;
      const isAllowed = template.allowedUsers.includes(currentUser.email);
      const isAdmin = currentUser.role === 'admin';

      return isOwner || isAllowed || isAdmin;
    });

    res.status(200).json(visibleTemplates);
  } catch (err) {
    console.error('getTemplates error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getTemplateById = async (req, res) => {
  try {
    const template = await Template.findByPk(req.params.id, {
      include: [{ model: Question, as: 'questions', separate: true, order: [['createdAt', 'ASC']], }]
    })

    if (!template) return res.status(404).json({ message: 'Not found' })

    if (
      template.access === 'restricted' &&
      template.authorId !== req.user.id &&
      !template.allowedUsers.includes(req.user.email) &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: 'Access denied' })
    }

    res.json(template)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}


// Delete template
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findByPk(req.params.id)
    if (!template) return res.status(404).json({ message: 'Not found' })

    if (template.authorId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not allowed' })
    }

    await template.destroy()
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.updateTemplate = async (req, res) => {
  const { id } = req.params
  const { title, formTitle, description } = req.body    

  try {
    const template = await Template.findByPk(id)
    if (!template) return res.status(404).json({ message: 'Not found' })

    await template.update({ title, formTitle, description }) 

    res.json({ message: 'Updated successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}


// PATCH /api/templates/:id/access
exports.updateTemplateAccess = async (req, res) => {
  const { id } = req.params;
  const { access, allowedUsers = [] } = req.body;

  try {
    const template = await Template.findByPk(id);
    if (!template) return res.status(404).json({ message: 'Template not found' });

    // Faqat egasi yoki admin o‘zgartira oladi
    if (template.authorId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    // access qiymatini tekshirish
    if (!['public', 'restricted'].includes(access)) {
      return res.status(400).json({ message: 'Invalid access value' });
    }

    await template.update({
      access,
      allowedUsers: access === 'restricted' ? allowedUsers : []
    });

    res.json({ message: 'Access updated successfully' });
  } catch (err) {
    console.error('❌ updateTemplateAccess error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



// PATCH /api/templates/:id/publish
exports.publishTemplate = async (req, res) => {
  try {
    const template = await Template.findByPk(req.params.id)

    if (!template) return res.status(404).json({ message: 'Not found' })

    if (template.authorId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not allowed' })
    }

    await template.update({ isPublished: true })

    res.json({ message: 'Form published successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}


// controllers/templateController.js

exports.deleteTemplates = async (req, res) => {
  const { templateIds } = req.body;

  // 1) Bad request tekshiruvi
  if (!Array.isArray(templateIds) || templateIds.length === 0) {
    return res.status(400).json({ message: 'No templates provided' });
  }

  try {
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;

    // 2) Ruxsat tekshiruvi: Mavjud templatelarni yuklab olib, faqat siznikilarni filtrlang
    const templates = await Template.findAll({
      where: { id: templateIds },
    });

    const deletableIds = templates
      .filter(t => t.authorId === userId || isAdmin)
      .map(t => t.id);

    if (deletableIds.length === 0) {
      return res.status(403).json({ message: 'Not allowed to delete these templates' });
    }

    // 3) Avval Answers o‘chirish
    await Answer.destroy({
      where: { templateId: deletableIds }
    });

    // 4) Keyin Questions o‘chirish
    await Question.destroy({
      where: { templateId: deletableIds }
    });

    // 5) Nihoyat Templates o‘chirish
    const deletedCount = await Template.destroy({
      where: { id: deletableIds }
    });

    // 6) Natijani qaytarish
    return res.json({
      message: `${deletedCount} templates (and their questions & answers) deleted successfully`,
      deletedIds: deletableIds
    });
  } catch (err) {
    console.error('❌ deleteTemplates error:', err);
    return res.status(500).json({ message: 'Server error while deleting templates' });
  }
};

