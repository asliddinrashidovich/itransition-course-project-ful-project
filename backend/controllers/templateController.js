const { User, Question, Template, Answer, TemplateLike } = require('../models')

// Create template with default question
exports.createTemplate = async (req, res) => {
  try {
    const userId = req.user.id
    const { title = "Untitled form", formTitle = "Untitled form", description = "Form description", topic = "", tags = [], imageUrl = "",
    access = "public", allowedUsers = [] } = req.body

    const newTemplate = await Template.create({ title, formTitle, description, topic, tags, imageUrl, access, allowedUsers, authorId: userId})

    await Question.create({ title: "Untitled question", description: "", type: "short_text", showInResults: false, templateId: newTemplate.id})
    const result = await Template.findByPk(newTemplate.id, { include: [{ model: Question, as: 'questions' }]})
    
    res.status(201).json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.getTemplates = async (req, res) => {
  try {
    const currentUser = req.user || null;

    const templates = await Template.findAll({
      include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email']}],
      order: [['createdAt', 'DESC']],
    });

    const visibleTemplates = templates.filter(template => {
      const access = template.access;
      const authorId = template.authorId;
      const allowedUsers = template.allowedUsers || [];

      if (access == 'public') return true;
      if (!currentUser) return false;

      const isOwner = authorId == currentUser.id;
      const isAllowed = allowedUsers.includes(currentUser.email);
      const isAdmin = currentUser.role == 'admin' || currentUser.isAdmin;

      return isOwner || isAllowed || isAdmin;
    });

    res.status(200).json(visibleTemplates);
  } catch (err) {
    console.error('getTemplates error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTemplateForPublic = async (req, res) => {
  try {
    const templates = await Template.findAll({
      where: { access: 'public' },
      include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email']}],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(templates);
  } catch (err) {
    console.error('getTemplateForPublic error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error' });
  }
};




exports.getTemplateById = async (req, res) => {
  try {
    const template = await Template.findByPk(req.params.id, {include: [{ model: Question, as: 'questions', separate: true, order: [['createdAt', 'ASC']], }]})
    if (!template) return res.status(404).json({ message: 'Not found' })

    if (
      template.access == 'restricted' &&
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

exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findByPk(req.params.id)
    if (!template) return res.status(404).json({ message: 'Not found' })

    if (template.authorId != req.user.id && !req.user.isAdmin) {
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

exports.updateTemplateAccess = async (req, res) => {
  const { id } = req.params;
  const { access, allowedUsers = [] } = req.body;

  try {
    const template = await Template.findByPk(id);
    if (!template) return res.status(404).json({ message: 'Template not found' });

    if (template.authorId != req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    if (!['public', 'restricted'].includes(access)) {
      return res.status(400).json({ message: 'Invalid access value' });
    }

    await template.update({ access, allowedUsers: access == 'restricted' ? allowedUsers : []});

    res.json({ message: 'Access updated successfully' });
  } catch (err) {
    console.error(' updateTemplateAccess error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.isTemplateLiked = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const likeRecord = await TemplateLike.findOne({ where: { userId, templateId: id }});
    const isLiked = !!likeRecord;

    res.json({ isLiked });
  } catch (err) {
    console.error(' isTemplateLiked error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.likeTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const template = await Template.findByPk(id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const alreadyLiked = await TemplateLike.findOne({ where: { userId, templateId: id }});
    if (alreadyLiked) {
      return res.status(400).json({ message: 'You already liked this template' });
    }

    await TemplateLike.create({ userId, templateId: id });
    template.likes += 1;
    await template.save();

    res.json({ message: 'Template liked', likes: template.likes });
  } catch (err) {
    console.error(' likeTemplate error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.unlikeTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const template = await Template.findByPk(id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const existingLike = await TemplateLike.findOne({ where: { userId, templateId: id }});
    if (!existingLike) {
      return res.status(400).json({ message: 'You have not liked this template' });
    }

    await existingLike.destroy();

    if (template.likes > 0) {
      template.likes -= 1;
      await template.save();
    }

    res.json({ message: 'Template unliked', likes: template.likes });
  } catch (err) {
    console.error('unlikeTemplate error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.publishTemplate = async (req, res) => {
  try {
    const template = await Template.findByPk(req.params.id)

    if (!template) return res.status(404).json({ message: 'Not found' })
  
    if (template.authorId != req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not allowed' })
    }

    await template.update({ isPublished: true })

    res.json({ message: 'Form published successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.deleteTemplates = async (req, res) => {
  const { templateIds } = req.body;

  if (!Array.isArray(templateIds) || templateIds.length === 0) {
    return res.status(400).json({ message: 'No templates provided' });
  }

  try {
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;

    const templates = await Template.findAll({ where: { id: templateIds }});
    const deletableIds = templates.filter(t => t.authorId == userId || isAdmin).map(t => t.id);

    if (deletableIds.length === 0) {
      return res.status(403).json({ message: 'Not allowed to delete these templates' });
    }

    await Answer.destroy({ where: { templateId: deletableIds}});
    await Question.destroy({ where: { templateId: deletableIds }});
    const deletedCount = await Template.destroy({ where: { id: deletableIds}});

    return res.json({
      message: `${deletedCount} templates (and their questions & answers) deleted successfully`,
      deletedIds: deletableIds
    });
  } catch (err) {
    console.error(' deleteTemplates error:', err);
    return res.status(500).json({ message: 'Server error while deleting templates' });
  }
};
