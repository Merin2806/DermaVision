const express = require('express');
const router = express.Router();
const {
  analyzeImage,
  getHistory,
  deleteScan
} = require('../controllers/scanController');
const { uploadImage } = require('../controllers/uploadController');
const { predictScan } = require('../controllers/predictionController');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const imageValidationMiddleware = require('../middleware/imageValidationMiddleware');
const { protect } = require('../middleware/authMiddleware');

// All scan routes are protected by JWT authentication
router.post('/analyze', protect, analyzeImage);
router.post('/scan/upload', protect, uploadMiddleware, uploadImage);
router.post('/scan/predict', protect, uploadMiddleware, imageValidationMiddleware, predictScan);
router.get('/history', protect, getHistory);
router.delete('/history/:id', protect, deleteScan);

module.exports = router;
