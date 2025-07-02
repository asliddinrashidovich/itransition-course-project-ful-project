const express = require('express')
const {
  createTemplate,
  getTemplateById,
  deleteTemplate,
  updateTemplate,
  publishTemplate,
  deleteTemplates,
  updateTemplateAccess,
  getTemplates,
} = require('../controllers/templateController')
const { protect } = require('../middlewares/authMiddleware')
const {
  addQuestionToTemplate,
  updateQuestion,
  updateQuestionType,
  updateQuestionTitle,
  deleteQuestion,
  addOptionToQuestion,
  deleteOptionFromQuestion,
  updateOptionTitle
} = require('../controllers/questionController')
const { getCommentsForTemplate, addComment, deleteComment } = require('../controllers/commentController')

const router = express.Router()

router.get('/', getTemplates)
router.get('/:id', protect, getTemplateById)
router.post('/', protect, createTemplate)
router.delete('/bulk', protect, deleteTemplates);
router.delete('/:id', protect, deleteTemplate)
router.put('/:id', protect, updateTemplate)
router.patch('/:id/access', protect, updateTemplateAccess);
router.patch('/:id/publish', protect, publishTemplate)  
router.post('/:id/questions', protect, addQuestionToTemplate)
router.put('/questions/:questionId', protect, updateQuestion)
router.delete('/questions/:questionId', protect, deleteQuestion);
router.put('/questions/:id/title', protect, updateQuestionTitle)
router.patch('/questions/:questionId/type', protect, updateQuestionType)
router.patch('/questions/:id/options',protect,  addOptionToQuestion);
router.patch('/questions/:id/options/delete', protect, deleteOptionFromQuestion);
router.patch('/questions/:id/options/update',protect, updateOptionTitle);
router.get('/:id/comments', getCommentsForTemplate);
router.post('/:id/comments', protect, addComment);
router.delete('/comments/:commentId', protect, deleteComment);

module.exports = router
