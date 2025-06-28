const { User, Question, Template } = require('../models')

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
exports.getPublicTemplates = async (req, res) => {
  try {
    const templates = await Template.findAll({
      where: { access: 'public' },
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']],
    });

    res.json(templates);
  } catch (err) {
    console.error('getPublicTemplates error:', err.message, err.stack);
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

