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
  likeTemplate,
  unlikeTemplate,
  isTemplateLiked,
  getTemplateForPublic,
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
const checkTemplateOwner = require('../middlewares/checkTemplateOwner')
const checkQuestionOwner = require('../middlewares/checkQuestionOwner')
const checkBulkTemplateOwner = require('../middlewares/checkBulkTemplates')
const { createSupportTicket } = require('../controllers/supportController')

const router = express.Router()

// template routes
router.get('/', protect, getTemplates)
router.get('/public', getTemplateForPublic); 
router.get('/:id', protect, getTemplateById)
router.post('/', protect, createTemplate)
router.delete('/bulk', protect, checkBulkTemplateOwner, deleteTemplates);
router.delete('/:id', protect, checkTemplateOwner, deleteTemplate)
router.put('/:id', protect, checkTemplateOwner, updateTemplate)
router.patch('/:id/access', protect, checkTemplateOwner, updateTemplateAccess);
router.patch('/:id/publish', protect, checkTemplateOwner, publishTemplate)  

// question routes
router.post('/:id/questions', protect, checkTemplateOwner, addQuestionToTemplate)
router.put('/questions/:questionId', protect, checkQuestionOwner, updateQuestion)
router.delete('/questions/:questionId', protect, checkQuestionOwner, deleteQuestion);
router.put('/questions/:id/title', protect, checkQuestionOwner, updateQuestionTitle)
router.patch('/questions/:questionId/type', protect, checkQuestionOwner, updateQuestionType)
router.patch('/questions/:id/options',protect, checkQuestionOwner, addOptionToQuestion);
router.patch('/questions/:id/options/delete', protect, checkQuestionOwner, deleteOptionFromQuestion);
router.patch('/questions/:id/options/update',protect, checkQuestionOwner, updateOptionTitle);

// like routes
router.patch('/:id/like', protect, likeTemplate);
router.patch('/:id/unlike', protect, unlikeTemplate); 
router.get('/:id/is-liked', protect, isTemplateLiked);

// comment routes
router.get('/:id/comments', getCommentsForTemplate);
router.post('/:id/comments', protect, addComment);
router.delete('/comments/:commentId', protect, deleteComment);

// intergation
router.post('/support-ticket', protect, createSupportTicket);

module.exports = router
