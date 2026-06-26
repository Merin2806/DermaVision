const express = require('express');
const router = express.Router();
const { generatePdfReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { validateReport } = require('../middleware/validationMiddleware');

// POST /api/report/generate — protected by JWT
router.post('/generate', protect, validateReport, generatePdfReport);

module.exports = router;
