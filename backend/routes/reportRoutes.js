const express = require('express');
const router = express.Router();
const { generatePdfReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/report/generate
 * @desc    Generate a hospital-style PDF diagnostic report using Puppeteer.
 * @access  Private (JWT protected)
 */
router.post('/generate', protect, generatePdfReport);

module.exports = router;
