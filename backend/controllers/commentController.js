const { Comment, User, Template } = require('../models');

exports.addComment = async (req, res) => {
  try {
    const { id: templateId } = req.params;
    const { text } = req.body;

    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!text?.trim()) return res.status(400).json({ message: 'Comment text required' });

    const template = await Template.findByPk(templateId);
    if (!template) return res.status(404).json({ message: 'Template not found' });

    const comment = await Comment.create({text, userId: req.user.id, templateId});
    const populated = await Comment.findByPk(comment.id, { include: [{ model: User, as: 'author', attributes: ['id', 'name'] }],});

    res.status(201).json(populated);
  } catch (err) {
    console.error('addComment error:', err);
    res.status(500).json({ message: 'Error in server' });
  }
};

exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;
  const isAdmin = req.user.isAdmin;

  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId !== userId && !isAdmin) {
      return res.status(403).json({ message: 'Not allowed to delete this comment' });
    }

    await comment.destroy();
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('deleteComment error:', err);
    res.status(500).json({ message: 'Error in server' });
  }
};

exports.getCommentsForTemplate = async (req, res) => {
  try {
    const { id: templateId } = req.params;

    const comments = await Comment.findAll({ where: { templateId }, order: [['createdAt', 'ASC']], include: [{ model: User, as: 'author', attributes: ['id', 'name']}]});

    res.json(comments);
  } catch (err) {
    console.error('getComments error:', err);
    res.status(500).json({ message: 'Error in server' });
  }
};
