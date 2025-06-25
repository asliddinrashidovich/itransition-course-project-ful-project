const express = require('express')
const {
  createTemplate,
  getPublicTemplates,
  getTemplateById,
  deleteTemplate,
  updateTemplate,
} = require('../controllers/templateController')
const { protect } = require('../middlewares/authMiddleware')
const { addQuestionToTemplate, updateQuestion, updateQuestionType, updateQuestionTitle} = require('../controllers/questionController')

const router = express.Router()

router.get('/', getPublicTemplates)
router.get('/:id', protect, getTemplateById)
router.post('/', protect, createTemplate)
router.delete('/:id', protect, deleteTemplate)
router.put('/:id', protect, updateTemplate)
router.post('/:id/questions', protect, addQuestionToTemplate)
router.put('/questions/:questionId', protect, updateQuestion)
router.patch('/questions/:questionId/type', protect, updateQuestionType)
router.put('/questions/:id/title', protect, updateQuestionTitle);

module.exports = router
