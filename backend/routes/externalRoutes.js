const express = require('express');
const router = express.Router();
const { getAggregatedTemplates } = require('../controllers/externalController');

router.get('/templates', getAggregatedTemplates);

module.exports = router;
