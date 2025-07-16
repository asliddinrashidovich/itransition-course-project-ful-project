const express = require('express');
const { syncUserToSalesforce } = require('../controllers/salesforceController');
const router = express.Router();

router.post('/sync', syncUserToSalesforce);

module.exports = router;
