const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { exportTemplateAsJSON } = require('../controllers/powerAutomate');

const router = express.Router();

router.post('/:id/export', protect, exportTemplateAsJSON);

module.exports = router;
