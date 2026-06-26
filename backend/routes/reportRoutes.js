const express = require('express');
const router = express.Router();
const { generatePdfReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/report/generate — protected by JWT
router.post('/generate', protect, generatePdfReport);

module.exports = router;
